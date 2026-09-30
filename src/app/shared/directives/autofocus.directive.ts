import { AfterViewInit, Directive, ElementRef, inject } from '@angular/core';

@Directive({selector:'[appAutofocus]',standalone:true})
export class AutofocusDirective implements AfterViewInit {
  private el=inject(ElementRef<HTMLInputElement>);
  ngAfterViewInit(){ queueMicrotask(()=>this.el.nativeElement.focus()); }
}
