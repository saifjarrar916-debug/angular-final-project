import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector:'app-filter-dialog',standalone:true,imports:[FormsModule],
  template:`
  @if(open()){<div class="backdrop" (click)="close.emit()"><section class="dialog" (click)="$event.stopPropagation()">
    <h3>Filters</h3>
    <div class="field"><label>Branch</label><select class="select" [ngModel]="branch()" (ngModelChange)="branch.set($event)"><option value="">All branches</option><option>Downtown Branch</option><option>Uptown Branch</option></select></div>
    <div class="field"><label>Status</label><select class="select" [ngModel]="status()" (ngModelChange)="status.set($event)"><option value="">All statuses</option><option>Active</option><option>Frozen</option><option>Expired</option></select></div>
    <div class="actions"><button class="btn" (click)="close.emit()">Cancel</button><button class="btn primary" (click)="apply()">Apply</button></div>
  </section></div>}
  `,
  styles:[`.backdrop{position:fixed;inset:0;background:#0006;display:grid;place-items:center;z-index:10}.dialog{background:#fff;width:360px;padding:22px;border-radius:6px;box-shadow:0 10px 30px #0003}.field{margin:15px 0}.actions{justify-content:flex-end;margin-top:20px}`]
})
export class FilterDialog {
  open=input(false); initialBranch=input(''); initialStatus=input('');
  filtersApplied=output<{branch:string,status:string}>(); close=output<void>();
  branch=signal(''); status=signal('');
  constructor(){ }
  apply(){this.filtersApplied.emit({branch:this.branch(),status:this.status()});this.close.emit()}
}
