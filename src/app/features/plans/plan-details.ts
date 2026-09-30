import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlanService } from './plan.service';
import { ToastService } from '../../shared/services/toast.service';

@Component({
 standalone:true,selector:'app-plan-details',imports:[FormsModule,RouterLink,CurrencyPipe],
 template:`
 <div class="page"><a class="link" routerLink="/plans">← Back to Plans</a><h1 class="page-title" style="margin-top:8px">{{isNew()?'Add Plan':isView()?'Plan Details':'Edit Plan'}}</h1>
 <section class="card section-card"><div class="form-grid">
 <div class="field"><label>Plan Name *</label><input class="input" [ngModel]="name()" (ngModelChange)="name.set($event)" [readonly]="isView()"></div>
 <div class="field"><label>Price *</label><input class="input" type="number" [ngModel]="price()" (ngModelChange)="price.set(+$event)" [readonly]="isView()"></div>
 <div class="field"><label>Duration (Months)</label><input class="input" type="number" [ngModel]="duration()" (ngModelChange)="duration.set(+$event)" [readonly]="isView()"></div>
 <div class="field"><label>Access Scope</label><select class="select" [ngModel]="access()" (ngModelChange)="access.set($event)" [disabled]="isView()"><option>All Branches</option><option>Downtown Only</option></select></div>
 <div class="field"><label>Max Freeze Days</label><input class="input" type="number" [ngModel]="maxFreezeDays()" (ngModelChange)="maxFreezeDays.set(+$event)" [readonly]="isView()"></div>
 <div class="field"><label>Max Freezes</label><input class="input" type="number" [ngModel]="maxFreezes()" (ngModelChange)="maxFreezes.set(+$event)" [readonly]="isView()"></div>
 <div class="field"><label>Guest Pass Quota</label><input class="input" type="number" [ngModel]="guestPassQuota()" (ngModelChange)="guestPassQuota.set(+$event)" [readonly]="isView()"></div>
 <div class="field"><label>Published</label><select class="select" [ngModel]="published()" (ngModelChange)="published.set($event)" [disabled]="isView()"><option [ngValue]="true">Yes</option><option [ngValue]="false">No</option></select></div>
 </div><div class="actions" style="margin-top:20px"><a class="btn" routerLink="/plans">Cancel</a>@if(!isView()){<button class="btn primary" [disabled]="!name()||price()<=0" (click)="save()">Save Plan</button>}</div></section></div>`
})
export class PlanDetails {
 private route=inject(ActivatedRoute);private router=inject(Router);private service=inject(PlanService);private toast=inject(ToastService);
 id=this.route.snapshot.paramMap.get('id');isNew=computed(()=>!this.id);isView=computed(()=>!!this.id&&!this.route.snapshot.url.some(s=>s.path==='edit'));
 name=signal('');price=signal(0);duration=signal(1);published=signal(true);maxFreezeDays=signal(30);maxFreezes=signal(2);guestPassQuota=signal(5);access=signal('All Branches');
 constructor(){if(this.id)this.service.get(this.id).subscribe(p=>{this.name.set(p.name);this.price.set(p.price);this.duration.set(p.durationMonths);this.published.set(p.isPublished);this.maxFreezeDays.set(p.maxFreezeDays);this.maxFreezes.set(p.maxFreezes);this.guestPassQuota.set(p.guestPassQuota);this.access.set(p.accessScope)})}
 save(){const p={name:this.name(),price:this.price(),durationMonths:this.duration(),isPublished:this.published(),maxFreezeDays:this.maxFreezeDays(),maxFreezes:this.maxFreezes(),guestPassQuota:this.guestPassQuota(),accessScope:this.access()};const req=this.id?this.service.update(this.id,p):this.service.create(p);req.subscribe(()=>{this.toast.show('Plan saved.');this.router.navigate(this.id?['/plans',this.id]:['/plans'])})}
}
