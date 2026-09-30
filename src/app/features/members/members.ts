import { Component, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { MemberService } from './member.service';
import { StatusBadge } from '../../shared/components/status-badge/status-badge';
import { Paginator } from '../../shared/components/paginator/paginator';
import { FilterDialog } from '../../shared/components/filter-dialog/filter-dialog';
import { HighlightPipe } from '../../shared/pipes/highlight.pipe';
import { AddMemberDialog } from '../../shared/components/add-member-dialog/add-member-dialog';

@Component({
  standalone: true,

  selector: 'app-members',

  imports: [
    RouterLink,
    StatusBadge,
    Paginator,
    FilterDialog,
    HighlightPipe
  ],

  template: `
    <div class="page">

      <div class="page-header">

        <div>
          <h1 class="page-title">
            Member Directory
          </h1>

          <p class="page-subtitle">
            Manage and view all registered members.
          </p>
        </div>

        <div class="actions">

          <button
            class="btn"
            (click)="filterOpen.set(true)"
          >
            ⚑ Filter
          </button>

          <button
            class="btn primary"
            (click)="add()"
          >
            ＋ Add Member
          </button>

        </div>

      </div>


      <div class="toolbar">

        <input
          class="input"
          style="max-width:360px"
          placeholder="Search members..."
          [value]="service.search()"
          (input)="service.search.set($any($event.target).value);load()"
        >

      </div>


      <section class="card table-wrap">

        <table>

          <thead>
            <tr>
              <th>Member Name</th>
              <th>ID</th>
              <th>Status</th>
              <th>Branch</th>
              <th>Last Visit</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            @for(m of members(); track m.id) {

              <tr>

                <td>
                  <a
                    class="link"
                    [routerLink]="['/members',m.id]"
                    [innerHTML]="m.name | highlight:service.search()"
                  ></a>
                </td>

                <td>
                  {{m.id}}
                </td>

                <td>
                  <app-status-badge
                    [status]="m.status"
                  />
                </td>

                <td>
                  {{m.branch}}
                </td>

                <td>
                  Today, 08:30 AM
                </td>

                <td>

                  <a
                    class="link"
                    [routerLink]="['/members',m.id]"
                  >
                    View
                  </a>

                 　

                  @if(m.status === 'Active') {

                    <a
                      class="link"
                      [routerLink]="['/members',m.id,'freeze']"
                    >
                      Freeze
                    </a>

                  }

                </td>

              </tr>

            }

          </tbody>

        </table>


        @if(!members().length) {

          <div class="empty">
            No members found.
          </div>

        }


        <app-paginator
          [total]="total()"
          [page]="page()"
          (pageChange)="changePage($event)"
        />

      </section>


      <app-filter-dialog
        [open]="filterOpen()"
        (close)="filterOpen.set(false)"
        (filtersApplied)="applyFilters($event)"
      />

    </div>
  `
})

export class Members {

  service = inject(MemberService);

  private dialog = inject(MatDialog);

  members = signal<any[]>([]);

  total = signal(0);

  page = signal(1);

  filterOpen = signal(false);


  constructor() {

    effect(() => {
      this.load();
    });

  }


  load() {

    this.service.list().subscribe(r => {

      this.members.set(r.items);

      this.total.set(r.total);

      this.page.set(this.service.page());

    });

  }


  changePage(p: number) {

    this.service.page.set(p);

    this.load();

  }


  applyFilters(f: { branch: string, status: string }) {

    this.service.branch.set(f.branch);

    this.service.status.set(f.status);

    this.service.page.set(1);

    this.load();

  }


  add() {

    const dialogRef = this.dialog.open(
      AddMemberDialog,
      {
        width: '450px'
      }
    );

    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        this.load();
      }

    });

  }

}