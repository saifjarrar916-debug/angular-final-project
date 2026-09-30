import { Component, input, output } from '@angular/core';

@Component({
  selector:'app-paginator',standalone:true,
  template:`<div class="pagination">@for(p of pages();track p){<button class="page-btn" [class.current]="p===page()" (click)="pageChange.emit(p)">{{p}}</button>}</div>`,
  styles:[`.pagination{display:flex;justify-content:flex-end;gap:6px;padding:12px}.page-btn{border:1px solid #e3e7ee;background:#fff;padding:7px 11px}.current{background:#062c78;color:#fff}`]
})
export class Paginator {
  total=input(0); page=input(1); pageSize=input(5); pageChange=output<number>();
  pages(){return Array.from({length:Math.max(1,Math.ceil(this.total()/this.pageSize()))},(_,i)=>i+1)}
}
