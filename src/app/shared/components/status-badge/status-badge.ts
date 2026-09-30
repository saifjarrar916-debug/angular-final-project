import { Component, input } from '@angular/core';
import { Status, ClassState } from '../../../models/models';

@Component({
  selector:'app-status-badge',standalone:true,
  template:`<span class="badge" [class.active]="tone()==='active'" [class.upcoming]="tone()==='upcoming'" [class.full]="tone()==='full'" [class.completed]="tone()==='completed'" [class.cancelled]="tone()==='cancelled'" [class.frozen]="tone()==='frozen'">{{status()}}</span>`,
  styles:[`.badge{display:inline-flex;padding:4px 8px;border-radius:999px;font-size:11px;font-weight:700}.active{background:#e4f6ec;color:#14804a}.upcoming{background:#edf2ff;color:#244b9b}.full{background:#fff0e1;color:#a25b00}.completed{background:#eef0f3;color:#596273}.cancelled{background:#fde9e9;color:#c52929}.frozen{background:#eef2ff;color:#5267a3}`]
})
export class StatusBadge {
  status=input.required<Status|ClassState>();
  tone(){return this.status().toLowerCase()}
}
