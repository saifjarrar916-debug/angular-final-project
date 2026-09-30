import { Directive, ElementRef, HostListener, output, inject } from '@angular/core';

@Directive({selector:'[appClickOutside]',standalone:true})
export class ClickOutsideDirective {
  outsideClick=output<void>();
  private el=inject(ElementRef);
  @HostListener('document:click',['$event.target']) onClick(target:EventTarget|null){
    if(target instanceof Node && !this.el.nativeElement.contains(target)) this.outsideClick.emit();
  }
}
