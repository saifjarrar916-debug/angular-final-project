import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { StatusBadge } from '../../shared/components/status-badge/status-badge';
import { CheckInService } from './checkin.service';
import { ClassService } from '../classes/class.service';

@Component({
  standalone:true,selector:'app-dashboard',imports:[RouterLink,DatePipe,DecimalPipe,StatusBadge],
  template:`
  <div class="page">
    <div class="page-header"><div><h1 class="page-title">Dashboard</h1><p class="page-subtitle">Live floor statistics and quick actions.</p></div></div>
    <div class="two-col">
      <div>
        <div class="grid kpi-grid">
          <div class="card kpi"><div class="kpi-label">Check-ins Today</div><div class="kpi-value">{{checkins.todayCount()}}</div><div class="kpi-note">+12% vs last week</div></div>
          <div class="card kpi"><div class="kpi-label">Active Members</div><div class="kpi-value">{{activeMembers() | number}}</div><div class="kpi-note">Currently on floor: 45</div></div>
        </div>
        <section class="card section-card" style="margin-top:16px">
          <div style="display:flex;justify-content:space-between"><h2 class="section-title">Upcoming Classes</h2><a class="link" routerLink="/classes">View Schedule</a></div>
          <div class="row-list">@for(c of upcoming();track c.id){<div class="row"><div><b>{{c.startTime}}</b><div class="small muted">{{c.name}} · {{c.studio}} · {{c.trainer}}</div></div><div><span class="small">{{c.enrolled}}/{{c.capacity}} Enrolled</span> <app-status-badge [status]="c.status"/></div></div>} @empty {<div class="empty">No upcoming classes.</div>}</div>
        </section>
      </div>
      <section class="card section-card"><h2 class="section-title">Quick Actions</h2><div class="row-list">
        <a class="row link" routerLink="/members">♙　New Member</a>
        <a class="row link" routerLink="/classes/new">⚒　Register Class</a>
        <a class="row link" routerLink="/trainers/new">♟　Add Trainer</a>
      </div></section>
    </div>
  </div>
  `
})
export class Dashboard {
  checkins=inject(CheckInService); classes=inject(ClassService);
  activeMembers=signal(1240);
  upcoming=computed(()=>this.classes.data().filter(c=>['Upcoming','Active','Full'].includes(c.status)).slice(0,4));
}
