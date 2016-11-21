import { Message } from './message.model';
import { Http, Response, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import { Observable } from 'rxjs';

@Injectable()
export class MessageService {
  private messages: Message[] = [];
  
  constructor(private http: Http) {}

  addMessage(message: Message) {
    this.messages.push(message);
    // Assign json message body
    const body = JSON.stringify(message);
    
    // Create headers to format our response as json.
    const headers = new Headers({'Content-Type': 'application/json'});

    // Set up observable. Doesn't send the request yet. The post will be sent when we
    // subscribe to the observable in the component that calls addMessage.
    return this.http.post('http://localhost:3000/message', body, {headers: headers})
           .map((response: Response) => response.json())
           .catch((error: Response) => Observable.throw(error.json()));
  }

  getMessage() {
    return this.messages;
  }

  deleteMessage(message: Message) {
    this.messages.splice(this.messages.indexOf(message), 1);
  }
}