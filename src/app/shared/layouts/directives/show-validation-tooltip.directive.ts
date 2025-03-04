import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appShowValidationTooltip]',
  standalone: true
})
export class ShowValidationTooltipDirective {
  @Input('appShowValidationTooltip') validationMessage: string | undefined = '';
  private focusableElement: HTMLElement | null = null;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) { }

  ngAfterViewInit() {
    // Delay to ensure PrimeNG internal elements are loaded
    setTimeout(() => {
      // Try to find a focusable element within PrimeNG component
      this.focusableElement = this.el.nativeElement.querySelector('input, textarea, [tabindex]');

      // Use the found focusable element, or fallback to the host element
      const targetElement = this.focusableElement || this.el.nativeElement;

      this.renderer.listen(targetElement, 'focus', () => this.showTooltip());
      this.renderer.listen(targetElement, 'blur', () => this.removeTooltip());
    }, 0);
  }

  // @HostListener('focus') onFocus() {
  //   this.showTooltip();
  // }

  // @HostListener('blur') onBlur() {
  //   this.removeTooltip();
  // }

  private showTooltip() {
    if (this.validationMessage) {
      const tooltipContainer = this.renderer.createElement('div');
      this.renderer.setAttribute(tooltipContainer, 'id', 'validation-tooltip');
      this.renderer.setAttribute(tooltipContainer, 'class', 'col-xl-12 d-flex justify-content-center tooltip-container');
      this.renderer.setStyle(tooltipContainer, 'top', `${this.el.nativeElement.offsetTop - 50}px`);
      const tooltip = this.renderer.createElement('span');
      const text = this.renderer.createText(this.validationMessage);
      this.renderer.appendChild(tooltip, text);
      this.renderer.setAttribute(tooltip, 'class', 'validation-tooltip ');
      this.renderer.appendChild(tooltipContainer, tooltip);
      this.renderer.appendChild(this.el.nativeElement.parentNode, tooltipContainer);
    }
  }

  private removeTooltip() {
    const tooltip = this.el.nativeElement.parentNode.querySelector('#validation-tooltip');
    if (tooltip) {
      this.renderer.removeChild(this.el.nativeElement.parentNode, tooltip);
    }
  }
}
