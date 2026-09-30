import { Component, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { PlanService } from './plan.service';
import { Paginator } from '../../shared/components/paginator/paginator';

@Component({
 standalone:true,selector:'app-plans',imports:[RouterLink,CurrencyPipe,Paginator],
 template:`
 <div class="page"><div class="page-header"><div><h1 class="page-title">Plans</h1><p class="page-subtitle">Manage membership plans and access rules.</p></div><a class="btn primary" routerLink="/plans/new">＋ Add Plan</a></div>
 <div class="toolbar"><input class="input" style="max-width:300px" placeholder="Search plans..." [value]="service.search()" (input)="service.search.set($any($event.target).value);load()"><select class="select" style="max-width:180px" [value]="service.duration()" (change)="service.duration.set($any($event.target).value);load()"><option value="">All durations</option><option value="1">1 month</option><option value="12">12 months</option></select><select class="select" style="max-width:180px" [value]="service.access()" (change)="service.access.set($any($event.target).value);load()"><option value="">All access</option><option>All Branches</option><option>Downtown Only</option></select></div>
 <section class="card table-wrap"><table><thead><tr><th>Name</th><th>Price</th><th>Duration</th><th>Access</th><th>Published</th><th></th></tr></thead><tbody>@for(p of plans();track p.id){<tr><td><a class="link" [routerLink]="['/plans',p.id]">{{p.name}}</a></td><td>{{p.price|currency}}</td><td>{{p.durationMonths}} months</td><td>{{p.accessScope}}</td><td>{{p.isPublished?'Yes':'No'}}</td><td><a class="link" [routerLink]="['/plans',p.id,'edit']">Edit</a></td></tr>}</tbody></table><app-paginator [total]="total()" [page]="service.page()" (pageChange)="service.page.set($event);load()"/></section></div>`
})
export class Plans {
 service=inject(PlanService);plans=signal<any[]>([]);total=signal(0);
 constructor(){effect(()=>this.load())}
 load(){this.service.list().subscribe(r=>{this.plans.set(r.items);this.total.set(r.total)})}
}
