import { Directive, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appUtcDate]',
  standalone: true
})
export class UtcDateDirective {
  @Input() appUtcDate: string | undefined;

  constructor(private ngControl: NgControl) { }

  @HostListener('ngModelChange', ['$event'])
  onChange(event: Date | string) {
    // Check if the value is a valid date
    if (event instanceof Date) {
      // Convert Date to UTC ISO string
      console.log(event.toISOString());
      this.ngControl.control?.setValue(event.toISOString());
    } else if (typeof event === 'string') {
      // Parse string to Date if necessary
      const parsedDate = new Date(event);
      if (!isNaN(parsedDate.getTime())) {
        this.ngControl.control?.setValue(parsedDate.toISOString());
      }
    }
  }
}
