import { Injectable, EventEmitter } from '@angular/core';
import { Message } from './message.model';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs';

@Injectable()
export class MessageService {
  private messages: Message[] = [];
  messageIsEdit = new EventEmitter<Message>();
  
  constructor(private http: Http) {}

  // Save a message
  addMessage(message: Message) {
    // Assign json message to body
    const body = JSON.stringify(message);
    
    // Create headers to format our response as json.
    const headers = new Headers({'Content-Type': 'application/json'});

    // Set token if it exists in localStorage else set token to empty string 
    const token = localStorage.getItem('token') 
                  ? '?token=' + localStorage.getItem('token')
                  : '';

    // Set up observable. Doesn't send the request yet. The post will be sent when we
    // subscribe to the observable in the component that calls addMessage.
    return this.http.post('http://localhost:3000/message' + token, body, {headers: headers})
            // Map the response into something usable
           .map((response: Response) => {
             const result = response.json();
             const message = new Message(result.obj.content, 'Dummy', result.obj._id, null);
             this.messages.push(message);
             return message;
            })
           .catch((error: Response) => Observable.throw(error.json()));
  }

  // Get all messages
  getMessages() {
    return this.http.get('http://localhost:3000/message')
           .map((response: Response) => {
             const messages = response.json().obj;
             let transformedMessages: Message[] = [];
             // Loop over our messages object and push the contents of each message
             // to transformedMessages array.
             for (let message of messages) {
                transformedMessages.push(new Message(message.content, 'Dummy', message._id, null));
             }
             this.messages = transformedMessages;
             // Return messages array.
             return transformedMessages;
           })
           .catch((error: Response) => Observable.throw(error.json()));
  }

  // Get selected message to prefill message input
  editMessage(message: Message) {
    this.messageIsEdit.emit(message);
  }

  // Update edited message
  updateMessage(message: Message) {
    // Assign updated message body
    const body = JSON.stringify(message);
    
    // Create headers to format our response as json.
    const headers = new Headers({'Content-Type': 'application/json'});

    // Set token if it exists in localStorage else set token to empty string 
    const token = localStorage.getItem('token') 
                  ? '?token=' + localStorage.getItem('token')
                  : '';

    // Set up observable. Doesn't send the request yet. The post will be sent when we
    // subscribe to the observable in the component that calls addMessage.
    return this.http.patch('http://localhost:3000/message/' + message.messageId + token, body, {headers: headers})
            // Map the response into something usable
           .map((response: Response) => response.json())
           .catch((error: Response) => Observable.throw(error.json()));
  }

  // Delete a message
  deleteMessage(message: Message) {
    this.messages.splice(this.messages.indexOf(message), 1);
  
    // Set token if it exists in localStorage else set token to empty string 
    const token = localStorage.getItem('token') 
                  ? '?token=' + localStorage.getItem('token')
                  : '';

    // Set up observable. Doesn't send the request yet. The post will be sent when we
    // subscribe to the observable in the component that calls addMessage.
    return this.http.delete('http://localhost:3000/message/' + message.messageId + token)
            // Map the response into something usable
           .map((response: Response) => response.json())
           .catch((error: Response) => Observable.throw(error.json()));
  }
}