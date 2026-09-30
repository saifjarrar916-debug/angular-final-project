import { Component, inject, signal } from '@angular/core';
import { ClassService } from './class.service';
@Component({standalone:true,template:`<div class="page"><h1 class="page-title">Book Session — Member View</h1><p class="page-subtitle">Available sessions for member self-service booking.</p><div class="grid">@for(c of classes();track c.id){<section class="card section-card"><h2>{{c.name}}</h2><p>{{c.date}} · {{c.startTime}} · {{c.trainer}}</p><button class="btn primary" [disabled]="c.enrolled>=c.capacity" (click)="selected.set(c.id)">{{selected()===c.id?'Booked':'Book'}}</button></section>}</div></div>`})
export class BookSessionMember {
 private service=inject(ClassService);classes=signal<any[]>([]);selected=signal('');constructor(){this.service.load();setTimeout(()=>this.classes.set(this.service.data()),200)}
}
