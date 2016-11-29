import { EventEmitter } from '@angular/core';
import { Error } from './error.model';

export class ErrorService {
  // Create eventemitter of type Error --> defined in our error model
  errorOccurred = new EventEmitter<Error>();

  handleError(error: any) {
    const errorData = new Error(error.title, error.message);
    this.errorOccurred.emit(errorData);
  }
}