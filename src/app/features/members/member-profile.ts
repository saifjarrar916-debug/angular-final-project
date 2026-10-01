import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MemberService } from './member.service';
import { StatusBadge } from '../../shared/components/status-badge/status-badge';
import { FreezeAllowancePipe } from '../../shared/pipes/freeze-allowance.pipe';
import { MatDialog } from '@angular/material/dialog';
import { EditMemberDialog } from '../../shared/components/edit-member-dialog/edit-member-dialog';

@Component({
 standalone:true,selector:'app-member-profile',imports:[RouterLink,CurrencyPipe,DatePipe,StatusBadge,FreezeAllowancePipe],
 template:`
 <div class="page">@if(member();as m){<div class="page-header"><div><a class="link" routerLink="/members">← Back to Members</a><h1 class="page-title">Member Profile</h1></div><button class="btn" (click)="editProfile(m)">
  Edit Profile
</button></div>
 <div class="two-col"><div><section class="card section-card"><div style="display:flex;justify-content:space-between"><div><div style="width:80px;height:80px;background:#dfe5ef;border-radius:5px"></div><h2>{{m.name}}</h2><div class="muted">ID: {{m.id}}</div></div><app-status-badge [status]="m.status"/></div><div class="row-list" style="margin-top:15px"><div class="row">✉ {{m.email}}</div><div class="row">☎ {{m.phone}}</div><div class="row">⌖ {{m.address}}</div><div class="row">▣ Joined: {{m.joinedDate|date}}</div></div></section>
 <section class="card section-card" style="margin-top:16px"><h2 class="section-title">Current Plan</h2><h3>{{m.planName}}</h3><b>{{m.planPrice|currency}} / year</b><p class="muted">Renews {{m.planEndDate|date}}</p><a class="btn" [routerLink]="['/members',m.id,'freeze']">Freeze Membership</a></section></div>
 <div><section class="card section-card"><h2 class="section-title">Freezes Used</h2><b>{{m.freezesUsed}} / {{m.maxFreezes}}</b><p class="muted">{{m.freezesUsed|freezeAllowance:m.maxFreezes}}</p></section><section class="card section-card" style="margin-top:16px"><h2 class="section-title">Guest Passes</h2><b>{{m.guestPassesUsed}} / {{m.guestPassQuota}}</b><p class="muted">{{m.guestPassQuota-m.guestPassesUsed}} passes remaining</p></section><section class="card section-card" style="margin-top:16px"><h2 class="section-title">Recent Activity</h2><div class="row-list"><div class="row">Facility Check-in <span>Today, 06:45 AM</span></div><div class="row">Class Attendance <span>Oct 18, 05:30 PM</span></div><div class="row">Facility Check-in <span>Oct 16, 06:40 AM</span></div></div></section></div></div>}@else{<div class="empty">Loading member...</div>}</div>`
})
export class MemberProfile {
    private dialog = inject(MatDialog);
 private route=inject(ActivatedRoute); private service=inject(MemberService); member=signal<any>(null);
 constructor(){this.service.get(this.route.snapshot.paramMap.get('id')!).subscribe(m=>this.member.set(m))}
editProfile(member: any) {

  const dialogRef = this.dialog.open(
    EditMemberDialog,
    {
      width: '450px',
      data: {
        member: member
      }
    }
  );

  dialogRef.afterClosed().subscribe(result => {

    if (result) {

      this.service
        .get(member.id)
        .subscribe(updatedMember => {
          this.member.set(updatedMember);
        });

    }

  });
}
}
