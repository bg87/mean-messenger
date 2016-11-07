import { Component } from '@angular/core';
import { Message } from './message.model';

@Component ({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})

export class MessageComponent {
  message: Message = {
        content: 'A message',
        username: 'Sammy'
    }
}