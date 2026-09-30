import { Injectable, signal } from '@angular/core';

@Injectable({providedIn:'root'})
export class ToastService {
  message=signal('');
  private timer:ReturnType<typeof setTimeout>|undefined;
  show(message:string){
    this.message.set(message);
    clearTimeout(this.timer);
    this.timer=setTimeout(()=>this.message.set(''),3500);
  }
}
