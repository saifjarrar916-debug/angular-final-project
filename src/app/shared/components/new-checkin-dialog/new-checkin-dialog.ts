import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';

import { MemberService } from '../../../features/members/member.service';
import { CheckInService } from '../../../features/dashboard/checkin.service';
import { AutofocusDirective } from '../../directives/autofocus.directive';
import { ToastService } from '../../services/toast.service';

@Component({

  selector: 'app-new-checkin-dialog',

  standalone: true,

  imports: [
    FormsModule,
    AutofocusDirective,
    MatDialogModule
  ],

  template: `

    <h2 mat-dialog-title>
      New Check-in
    </h2>

    <div class="body">

      <div class="field">

        <label>Member *</label>

        <input
          appAutofocus
          class="input"
          placeholder="Search member..."
          [ngModel]="memberName()"
          (ngModelChange)="memberName.set($event)"
        >

      </div>

      <div class="field">

        <label>Date *</label>

        <input
          class="input"
          type="date"
          [ngModel]="date()"
          (ngModelChange)="date.set($event)"
        >

      </div>

      <div class="field">

        <label>Time *</label>

        <input
          class="input"
          type="time"
          step="300"
          [ngModel]="time()"
          (ngModelChange)="time.set($event)"
        >

      </div>

      <div class="field">

        <label>Branch</label>

        <input
          class="input"
          value="Downtown Branch"
          readonly
        >

      </div>

      <div class="field">

        <label>Notes</label>

        <textarea
          class="textarea"
          [ngModel]="notes()"
          (ngModelChange)="notes.set($event)"
          maxlength="500"
        ></textarea>

      </div>

    </div>

    <div class="actions">

      <button
        class="btn"
        (click)="ref.close()"
      >
        Cancel
      </button>

      <button
        class="btn primary"
        [disabled]="!memberName() || !date() || !time()"
        (click)="save()"
      >
        Save Check-in
      </button>

    </div>

  `,

  styles: [`

    .body {
      padding: 0 24px 8px
    }

    .field {
      margin: 12px 0
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding: 14px 24px;
      border-top: 1px solid #e3e7ee
    }

    .input,
    .textarea {
      width: 100%;
      padding: 9px;
      border: 1px solid #ccd2dc;
      border-radius: 4px
    }

    .field label {
      display: block;
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 6px
    }

  `]

})

export class NewCheckinDialog {

  // removed private because template uses ref
  ref = inject(MatDialogRef<NewCheckinDialog>);

  private checkins = inject(CheckInService);

  private toast = inject(ToastService);

  memberName = signal('');

  date = signal(
    new Date().toISOString().slice(0, 10)
  );

  time = signal('09:00');

  notes = signal('');

  save() {

    this.checkins.create({

      memberId: '',

      memberName: this.memberName(),

      date: this.date(),

      time: this.time(),

      branch: 'Downtown Branch',

      notes: this.notes()

    }).subscribe(() => {

      this.toast.show(
        'Check-in added successfully.'
      );

      this.ref.close(true);

    });

  }

}