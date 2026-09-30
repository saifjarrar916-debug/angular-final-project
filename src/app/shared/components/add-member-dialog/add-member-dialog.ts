import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';

import { MemberService } from '../../../features/members/member.service';
import { Member } from '../../../models/models';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-add-member-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatDialogModule
  ],

  template: `

    <h2 mat-dialog-title>
      Add Member
    </h2>

    <div class="body">

      <div class="field">
        <label>Name *</label>

        <input
          class="input"
          placeholder="Enter member name"
          [ngModel]="name()"
          (ngModelChange)="name.set($event)"
        >
      </div>

      <div class="field">
        <label>Branch *</label>

        <select
          class="input"
          [ngModel]="branch()"
          (ngModelChange)="branch.set($event)"
        >
          <option value="">Select branch</option>
          <option value="Downtown Branch">Downtown Branch</option>
          <option value="Uptown Branch">Uptown Branch</option>
        </select>
      </div>

      <div class="field">
        <label>Status *</label>

        <select
          class="input"
          [ngModel]="status()"
          (ngModelChange)="status.set($event)"
        >
          <option value="">Select status</option>
          <option value="Active">Active</option>
          <option value="Frozen">Frozen</option>
          <option value="Expired">Expired</option>
        </select>
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
        [disabled]="!name() || !branch() || !status()"
        (click)="save()"
      >
        Add Member
      </button>

    </div>
  `,

  styles: [`

    .body {
      padding: 0 24px 8px;
    }

    .field {
      margin: 14px 0;
    }

    .field label {
      display: block;
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 6px;
    }

    .input {
      width: 100%;
      padding: 9px;
      border: 1px solid #ccd2dc;
      border-radius: 4px;
      box-sizing: border-box;
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding: 14px 24px;
      border-top: 1px solid #e3e7ee;
    }

  `]
})

export class AddMemberDialog {

  ref = inject(MatDialogRef<AddMemberDialog>);

  private members = inject(MemberService);

  private toast = inject(ToastService);

  name = signal('');

  branch = signal('');

  status = signal<Member['status'] | ''>('');

  save() {

    if (!this.name() || !this.branch() || !this.status()) {
      return;
    }

    this.members.create({

      name: this.name(),

      branch: this.branch(),

      status: this.status() as Member['status']

    }).subscribe(() => {

      this.toast.show(
        'Member added successfully.'
      );

      this.ref.close(true);

    });
  }
}