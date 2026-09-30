import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ClassService } from './class.service';
@Component({standalone:true,imports:[RouterLink],template:`<div class="page"><a class="link" routerLink="/classes">← Back to Classes</a><h1 class="page-title" style="margin-top:10px">Book Session</h1>@if(cls();as c){<section class="card section-card"><h2>{{c.name}}</h2><p>{{c.date}} · {{c.startTime}} · {{c.trainer}}</p><p>{{c.enrolled}} / {{c.capacity}} enrolled</p><button class="btn primary" (click)="booked.set(true)" [disabled]="booked()"> {{booked()?'Booked':'Confirm Booking'}} </button></section>}</div>`})
export class BookSession {
 private route=inject(ActivatedRoute);private service=inject(ClassService);cls=signal<any>(null);booked=signal(false);
 constructor(){this.service.get(this.route.snapshot.paramMap.get('id')!).subscribe(c=>this.cls.set(c))}
}
