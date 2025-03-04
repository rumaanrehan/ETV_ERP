import { Directive, HostListener, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Directive({
  selector: '[appConvertToUTC]',
  standalone: true
})
export class ConvertToUTCDirective {
  @Input() appConvertToUTC!: FormControl;

  constructor() { }

  @HostListener('change', ['$event'])
  onChange(event: Date) {
    if (event instanceof Date) {
      const utcDate = this.convertToUTC(event);
      this.appConvertToUTC.setValue(utcDate, { emitEvent: false });
    }
  }

  private convertToUTC(date: Date): string {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString();
  }
}
