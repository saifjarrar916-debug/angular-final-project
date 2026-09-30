import { Component, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TrainerService } from './trainer.service';
import { Paginator } from '../../shared/components/paginator/paginator';

@Component({
 standalone:true,selector:'app-trainers',imports:[RouterLink,Paginator],
 template:`
 <div class="page"><div class="page-header"><div><h1 class="page-title">Trainer Directory</h1><p class="page-subtitle">Manage trainers and instructors.</p></div><a class="btn primary" routerLink="/trainers/new">＋ Add Trainer</a></div>
 <div class="toolbar"><input class="input" style="max-width:300px" placeholder="Search trainers..." [value]="service.search()" (input)="service.search.set($any($event.target).value);load()"><select class="select" style="max-width:180px" [value]="service.branch()" (change)="service.branch.set($any($event.target).value);load()"><option value="">All branches</option><option>Downtown Branch</option><option>Uptown Branch</option></select><select class="select" style="max-width:150px" [value]="service.status()" (change)="service.status.set($any($event.target).value);load()"><option value="">All status</option><option>Active</option><option>Inactive</option></select></div>
 <section class="card table-wrap"><table><thead><tr><th>Name</th><th>Specialty</th><th>Branch</th><th>Email</th><th>Status</th><th></th></tr></thead><tbody>@for(t of trainers();track t.id){<tr><td><a class="link" [routerLink]="['/trainers',t.id]">{{t.name}}</a></td><td>{{t.specialty}}</td><td>{{t.branch}}</td><td>{{t.email}}</td><td><span class="badge" [class.active]="t.isActive">{{t.isActive?'Active':'Inactive'}}</span></td><td><a class="link" [routerLink]="['/trainers',t.id,'edit']">Edit</a></td></tr>}</tbody></table><app-paginator [total]="total()" [page]="service.page()" (pageChange)="service.page.set($event);load()"/></section></div>`
})
export class Trainers {
 service=inject(TrainerService);trainers=signal<any[]>([]);total=signal(0);
 constructor(){effect(()=>this.load())}
 load(){this.service.list().subscribe(r=>{this.trainers.set(r.items);this.total.set(r.total)})}
}
