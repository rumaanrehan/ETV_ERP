import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PageHeaderService {
  private templateSubject = new Subject<any>();
  //private buttonClickSubject = new Subject<any>();

  // Method to set the template from the routed component
  setTemplate(template: any) {
    this.templateSubject.next(template);
  }

  // Observable to pass the template to the header component
  getTemplate(): Observable<any> {
    return this.templateSubject.asObservable();
  }

  //// Method to emit button click events
  //buttonClicked(event: any) {
  //  this.buttonClickSubject.next(event);
  //}

  //// Observable to handle the button click event
  //onButtonClicked(): Observable<any> {
  //  return this.buttonClickSubject.asObservable();
  //}
}
