import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TrainerService } from './trainer.service';
import { ToastService } from '../../shared/services/toast.service';

@Component({
 standalone:true,selector:'app-trainer-details',imports:[FormsModule,RouterLink],
 template:`
 <div class="page"><a class="link" routerLink="/trainers">← Back to Trainers</a><div class="page-header" style="margin-top:8px"><div><h1 class="page-title">{{isNew()?'Add Trainer':isView()?'Trainer Details':'Edit Trainer'}}</h1><p class="page-subtitle">Create, view or update trainer information.</p></div></div>
 <section class="card section-card"><div class="form-grid">
 <div class="field"><label>Name *</label><input class="input" [ngModel]="name()" (ngModelChange)="name.set($event)" [readonly]="isView()"></div>
 <div class="field"><label>Specialty *</label><input class="input" [ngModel]="specialty()" (ngModelChange)="specialty.set($event)" [readonly]="isView()"></div>
 <div class="field"><label>Branch *</label><select class="select" [ngModel]="branch()" (ngModelChange)="branch.set($event)" [disabled]="isView()"><option>Downtown Branch</option><option>Uptown Branch</option></select></div>
 <div class="field"><label>Email</label><input class="input" type="email" [ngModel]="email()" (ngModelChange)="email.set($event)" [readonly]="isView()"></div>
 <div class="field"><label>Phone</label><input class="input" [ngModel]="phone()" (ngModelChange)="phone.set($event)" [readonly]="isView()"></div>
 <div class="field"><label>Status</label><select class="select" [ngModel]="active()" (ngModelChange)="active.set($event)" [disabled]="isView()"><option [ngValue]="true">Active</option><option [ngValue]="false">Inactive</option></select></div>
 </div><div class="actions" style="margin-top:20px"><a class="btn" routerLink="/trainers">Cancel</a>@if(!isView()){<button class="btn primary" [disabled]="!name()||!specialty()" (click)="save()">Save Trainer</button>}</div></section></div>`
})
export class TrainerDetails {
 private route=inject(ActivatedRoute);private router=inject(Router);private service=inject(TrainerService);private toast=inject(ToastService);
 id=this.route.snapshot.paramMap.get('id');isNew=computed(()=>!this.id);isView=computed(()=>!!this.id&&!this.route.snapshot.url.some(s=>s.path==='edit'));
 name=signal('');specialty=signal('');branch=signal('Downtown Branch');email=signal('');phone=signal('');active=signal(true);
 constructor(){if(this.id)this.service.get(this.id).subscribe(t=>{this.name.set(t.name);this.specialty.set(t.specialty);this.branch.set(t.branch);this.email.set(t.email);this.phone.set(t.phone);this.active.set(t.isActive)})}
 save(){const t={name:this.name(),specialty:this.specialty(),branch:this.branch(),email:this.email(),phone:this.phone(),isActive:this.active()};const req=this.id?this.service.update(this.id,t):this.service.create(t);req.subscribe(()=>{this.toast.show('Trainer saved.');this.router.navigate(this.id?['/trainers',this.id]:['/trainers'])})}
}
