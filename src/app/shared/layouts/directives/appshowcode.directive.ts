import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appShowCode]',
  // standalone: true
})
export class AppshowcodeDirective {
  private isCodeVisible = false;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  isContentVisible = false;
  toggleClass = "line";

  @HostListener('click') onClick() {
    const cardElement = this.el.nativeElement.closest('.card');
    if (cardElement) {
      const cardBody = cardElement.querySelector('.card-body');
      const cardFooter = cardElement.querySelector('.card-footer');

      if (cardBody && cardFooter) {
        cardBody.classList.toggle('d-none');
        cardFooter.classList.toggle('d-none');

        const codeContent = cardBody.innerHTML.replace(/<\/\w+>/g, '$&\n\n').replace(/^\s+/gim, '');
        cardFooter.innerText = codeContent;

        this.isCodeVisible = !this.isCodeVisible; // Toggle the state
      }
    }

    this.isContentVisible = !this.isContentVisible;
    if (this.toggleClass === "line") {
      this.toggleClass = "s-slash-line";
    } else {
      this.toggleClass = "line";
    }
  }

  }

  