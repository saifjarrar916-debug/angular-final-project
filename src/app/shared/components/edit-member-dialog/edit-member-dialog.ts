import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';

import { MemberService } from '../../../features/members/member.service';
import { Member } from '../../../models/models';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-edit-member-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatDialogModule
  ],

  template: `
    <h2 mat-dialog-title>
      Edit Profile
    </h2>

    <div class="body">

      <div class="field">
        <label>Name *</label>

        <input
          class="input"
          [ngModel]="name()"
          (ngModelChange)="name.set($event)"
        >
      </div>

      <div class="field">
        <label>Email</label>

        <input
          class="input"
          type="email"
          [ngModel]="email()"
          (ngModelChange)="email.set($event)"
        >
      </div>

      <div class="field">
        <label>Phone</label>

        <input
          class="input"
          [ngModel]="phone()"
          (ngModelChange)="phone.set($event)"
        >
      </div>

      <div class="field">
        <label>Address</label>

        <input
          class="input"
          [ngModel]="address()"
          (ngModelChange)="address.set($event)"
        >
      </div>

      <div class="field">
        <label>Branch</label>

        <select
          class="input"
          [ngModel]="branch()"
          (ngModelChange)="branch.set($event)"
        >
          <option value="Downtown Branch">Downtown Branch</option>
          <option value="Uptown Branch">Uptown Branch</option>
        </select>
      </div>

      <div class="field">
        <label>Status</label>

        <select
          class="input"
          [ngModel]="status()"
          (ngModelChange)="status.set($event)"
        >
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
        [disabled]="!name()"
        (click)="save()"
      >
        Save Changes
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

export class EditMemberDialog {

  ref = inject(MatDialogRef<EditMemberDialog>);

  private members = inject(MemberService);

  private toast = inject(ToastService);

  private data = inject<{ member: Member }>(MAT_DIALOG_DATA);

  name = signal(this.data.member.name);

  email = signal(this.data.member.email);

  phone = signal(this.data.member.phone);

  address = signal(this.data.member.address);

  branch = signal(this.data.member.branch);

  status = signal<Member['status']>(this.data.member.status);

  save() {

    this.members.update(this.data.member.id, {

      name: this.name(),

      email: this.email(),

      phone: this.phone(),

      address: this.address(),

      branch: this.branch(),

      status: this.status()

    }).subscribe(() => {

      this.toast.show('Profile updated successfully.');

      this.ref.close(true);

    });

  }
}