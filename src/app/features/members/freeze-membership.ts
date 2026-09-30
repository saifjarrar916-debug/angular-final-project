import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { MemberService } from './member.service';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  standalone: true,
  selector: 'app-freeze-membership',
  imports: [RouterLink, FormsModule, DatePipe],

  template: `
    <div class="page">

      @if(member(); as m) {

        <a
          class="link"
          [routerLink]="['/members', m.id]"
        >
          ← Back to Member Profile
        </a>

        <h1
          class="page-title"
          style="margin-top:8px"
        >
          Freeze Membership
        </h1>

        <p class="page-subtitle">
          Temporarily suspend a membership contract.
        </p>


        <div
          class="two-col"
          style="margin-top:22px"
        >

          <section class="card section-card">

            <h2 class="section-title">
              Freeze Parameters
            </h2>

            <div class="form-grid">

              <div class="field">

                <label>
                  Start Date
                </label>

                <input
                  class="input"
                  type="date"
                  [ngModel]="startDate()"
                  (ngModelChange)="startDate.set($event)"
                >

              </div>


              <div class="field">

                <label>
                  Duration (Months)
                </label>

                <select
                  class="select"
                  [ngModel]="duration()"
                  (ngModelChange)="duration.set(+$event)"
                >

                  <option [ngValue]="1">
                    1 Month
                  </option>

                  <option [ngValue]="2">
                    2 Months
                  </option>

                  <option [ngValue]="3">
                    3 Months
                  </option>

                </select>

              </div>


              <div class="field full">

                <label>
                  Reason for Freeze
                </label>

                <select
                  class="select"
                  [ngModel]="reason()"
                  (ngModelChange)="reason.set($event)"
                >

                  <option>
                    Extended Travel
                  </option>

                  <option>
                    Medical
                  </option>

                  <option>
                    Injury
                  </option>

                  <option>
                    Financial
                  </option>

                  <option>
                    Other
                  </option>

                </select>

              </div>


              <div class="field full">

                <label>
                  Additional Notes (Optional)
                </label>

                <textarea
                  class="textarea"
                  maxlength="500"
                  [ngModel]="notes()"
                  (ngModelChange)="notes.set($event)"
                ></textarea>

              </div>

            </div>

          </section>


          <aside class="card section-card">

            <h2 class="section-title">
              Projected Impact
            </h2>

            <div class="row">
              Original End Date
              <b>{{m.planEndDate | date}}</b>
            </div>

            <div class="row">
              Freeze Duration
              <b>{{duration()}} Month(s)</b>
            </div>

            <div class="row">
              <b>New End Date</b>
              <b>{{newEndDate() | date}}</b>
            </div>

            <p class="small muted">
              Billing will automatically pause during the freeze period.
            </p>


            <button
              class="btn primary"
              style="width:100%"
              [disabled]="!reason() || !startDate()"
              (click)="confirm(m.id)"
            >
              ⚙ Confirm Freeze
            </button>

          </aside>

        </div>

      }

    </div>
  `
})

export class FreezeMembership {

  private route = inject(ActivatedRoute);

  private router = inject(Router);

  private service = inject(MemberService);

  private toast = inject(ToastService);


  member = signal<any>(null);

  startDate = signal(
    new Date().toISOString().slice(0, 10)
  );

  duration = signal(1);

  reason = signal('Extended Travel');

  notes = signal('');


  newEndDate = computed(() => {

    const m = this.member();

    if (!m) {
      return new Date();
    }

    const d = new Date(m.planEndDate);

    d.setMonth(
      d.getMonth() + this.duration()
    );

    return d;

  });


  constructor() {

    this.service
      .get(this.route.snapshot.paramMap.get('id')!)
      .subscribe(m => {

        this.member.set(m);

      });

  }


  confirm(id: string) {

    this.service.update(id, {

      status: 'Frozen',

      planEndDate: this.newEndDate()
        .toISOString()
        .slice(0, 10)

    }).subscribe(() => {

      this.toast.show(
        'Membership freeze confirmed.'
      );

      this.router.navigate([
        '/members',
        id
      ]);

    });

  }

}