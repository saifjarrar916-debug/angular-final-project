import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClassService } from './class.service';
import { ToastService } from '../../shared/services/toast.service';
import { FitnessClass } from '../../models/models';

@Component({
  standalone: true,
  selector: 'app-class-details',
  imports: [FormsModule, RouterLink],

  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <a class="link" routerLink="/classes">← Back to Schedule</a>

          <h1 class="page-title">
            {{ isNew() ? 'Add New Class' : isView() ? 'Class Details' : 'Edit Class' }}
          </h1>
        </div>
      </div>

      <section class="card section-card">
        <div class="form-grid">

          <div class="field">
            <label>Class Name *</label>
            <input
              class="input"
              [ngModel]="name()"
              (ngModelChange)="name.set($event)"
              [readonly]="isView()"
            >
          </div>

          <div class="field">
            <label>Branch *</label>
            <select
              class="select"
              [ngModel]="branch()"
              (ngModelChange)="branch.set($event)"
              [disabled]="isView()"
            >
              <option>Downtown Branch</option>
              <option>Uptown Branch</option>
            </select>
          </div>

          <div class="field">
            <label>Trainer / Instructor</label>
            <input
              class="input"
              [ngModel]="trainer()"
              (ngModelChange)="trainer.set($event)"
              [readonly]="isView()"
            >
          </div>

          <div class="field">
            <label>Studio / Room</label>
            <input
              class="input"
              [ngModel]="studio()"
              (ngModelChange)="studio.set($event)"
              [readonly]="isView()"
            >
          </div>

          <div class="field">
            <label>Date *</label>
            <input
              class="input"
              type="date"
              [ngModel]="date()"
              (ngModelChange)="date.set($event)"
              [disabled]="isView()"
            >
          </div>

          <div class="field">
            <label>Start Time *</label>
            <input
              class="input"
              type="time"
              [ngModel]="startTime()"
              (ngModelChange)="startTime.set($event)"
              [disabled]="isView()"
            >
          </div>

          <div class="field">
            <label>Capacity Limit</label>
            <input
              class="input"
              type="number"
              [ngModel]="capacity()"
              (ngModelChange)="capacity.set(+$event)"
              [readonly]="isView()"
            >
          </div>

          <div class="field">
            <label>Duration</label>
            <select
              class="select"
              [ngModel]="duration()"
              (ngModelChange)="duration.set(+$event)"
              [disabled]="isView()"
            >
              <option [ngValue]="30">30 min</option>
              <option [ngValue]="45">45 min</option>
              <option [ngValue]="60">60 min</option>
            </select>
          </div>

          <div class="field full">
            <label>Description</label>
            <textarea
              class="textarea"
              [ngModel]="description()"
              (ngModelChange)="description.set($event)"
              [readonly]="isView()"
            ></textarea>
          </div>

        </div>

        <div class="actions" style="margin-top:20px">

          <a class="btn" routerLink="/classes">
            Cancel
          </a>

          @if(!isView()) {
            <button
              class="btn primary"
              [disabled]="!name() || !date() || !startTime()"
              (click)="save()"
            >
              ▣ {{ isNew() ? 'Schedule Class' : 'Save Changes' }}
            </button>
          }

        </div>
      </section>
    </div>
  `
})
export class ClassDetails {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private service = inject(ClassService);
  private toast = inject(ToastService);

  id = this.route.snapshot.paramMap.get('id');

  isNew = computed(() => !this.id);

  isView = computed(() =>
    !!this.id &&
    !this.route.snapshot.url.some(s => s.path === 'edit')
  );

  name = signal('');
  branch = signal('Downtown Branch');
  trainer = signal('');
  studio = signal('Studio A');
  date = signal(new Date().toISOString().slice(0, 10));
  startTime = signal('09:00');
  capacity = signal(20);
  duration = signal(45);
  description = signal('');

  constructor() {

    if (this.id) {

      this.service.get(this.id).subscribe(c => {

        this.name.set(c.name);
        this.branch.set(c.branch);
        this.trainer.set(c.trainer);
        this.studio.set(c.studio);
        this.date.set(c.date);
        this.startTime.set(c.startTime);
        this.capacity.set(c.capacity);
        this.duration.set(c.duration);
        this.description.set(c.description);

      });

    }

  }

  save() {

    const c: Partial<FitnessClass> = {
      name: this.name(),
      branch: this.branch(),
      trainer: this.trainer(),
      studio: this.studio(),
      date: this.date(),
      startTime: this.startTime(),
      capacity: this.capacity(),
      duration: this.duration(),
      description: this.description(),
      status: 'Upcoming',
      enrolled: 0,
      waitlist: 0
    };

    const req = this.id
      ? this.service.update(this.id, c)
      : this.service.create(c);

    req.subscribe(() => {

      this.toast.show('Class saved.');
      this.router.navigate(['/classes']);

    });

  }

}