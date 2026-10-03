import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClassService } from './class.service';
import { StatusBadge } from '../../shared/components/status-badge/status-badge';

@Component({
 standalone:true,selector:'app-classes',imports:[RouterLink,StatusBadge],
 template:`
 <div class="page"><div class="page-header"><div><h1 class="page-title">Class Schedule</h1><p class="page-subtitle">Manage and monitor today's sessions.</p></div><div class="actions"><select class="select" style="width:150px" aria-label="Filter by branch" (change)="branch.set($any($event.target).value)"><option value="">All Branches</option>@for(b of branches();track b){<option [value]="b">{{b}}</option>}</select><input class="input" style="width:145px" type="date" aria-label="Filter by date" [value]="date()" (change)="date.set($any($event.target).value)"><a class="btn primary" routerLink="/classes/new">＋ Add Class</a></div></div>
 <div class="two-col"><section class="card section-card"><h2 class="section-title">Today's Sessions</h2>@for(c of classes();track c.id){<div class="row"><div><b>{{c.startTime}}　{{c.name}}</b><div class="small muted">♙ {{c.trainer}}　⌖ {{c.studio}}</div></div><div><app-status-badge [status]="c.status"/><b>{{c.enrolled}} / {{c.capacity}}</b><div class="small muted">Waitlist: {{c.waitlist}}</div><a class="link small" [routerLink]="['/classes',c.id]">View</a><br><a class="link small" [routerLink]="['/classes',c.id,'book']">Book Session</a></div></div>} @empty {<div class="empty">No sessions match your filters.</div>}</section>
 <aside class="card section-card"><h2 class="section-title">Capacity Overview</h2><div class="grid kpi-grid"><div class="kpi"><div class="kpi-label">Total Bookings</div><div class="kpi-value">{{bookings()}}</div></div><div class="kpi"><div class="kpi-label">Avg Fill Rate</div><div class="kpi-value">{{fillRate()}}%</div></div></div></aside></div></div>`
})
export class Classes {
 service=inject(ClassService); branch=signal(''); date=signal(''); branches=computed(()=>[...new Set(this.service.data().map(c=>c.branch))]); classes=computed(()=>this.service.data().filter(c=>(!this.branch()||c.branch===this.branch())&&(!this.date()||c.date===this.date()))); bookings=computed(()=>this.classes().reduce((n,c)=>n+c.enrolled,0)); fillRate=computed(()=>Math.round(this.bookings()/Math.max(1,this.classes().reduce((n,c)=>n+c.capacity,0))*100));
}
