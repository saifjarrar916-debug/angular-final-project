import { Injectable, signal } from '@angular/core';
import { of } from 'rxjs';
import { Member, ApiList } from '../../models/models';
import membersData from '../../../assets/data/members.json';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  private data = signal<Member[]>(
    membersData.map(member => ({
      ...member,
      status: member.status as Member['status']
    }))
  );

  page = signal(1);
  pageSize = signal(5);
  search = signal('');
  branch = signal('');
  status = signal('');

  list() {

    const search = this.search()
      .toLowerCase()
      .trim();

    const filtered = this.data().filter(member =>

      (!search ||
        member.name.toLowerCase().includes(search) ||
        member.id.toLowerCase().includes(search)
      )

      &&

      (!this.branch() ||
        member.branch === this.branch()
      )

      &&

      (!this.status() ||
        member.status === this.status()
      )

    );

    const start =
      (this.page() - 1) * this.pageSize();

    const items =
      filtered.slice(
        start,
        start + this.pageSize()
      );

    return of<ApiList<Member>>({
      items,
      total: filtered.length
    });

  }

  get(id: string) {

    return of(
      this.data().find(member => member.id === id)!
    );

  }

  create(member: Partial<Member>) {

    const newMember: Member = {

      id: `#TF-${Math.floor(
        1000 + Math.random() * 9000
      )}`,

      name: member.name ?? 'New Member',

      branch: member.branch ?? 'Downtown Branch',

      status: member.status ?? 'Active',

      joinedDate:
        new Date().toISOString().slice(0, 10),

      email: member.email ?? '',

      phone: member.phone ?? '',

      address: member.address ?? '',

      planName: member.planName ?? '',

      planPrice: member.planPrice ?? 0,

      planEndDate: member.planEndDate ?? '',

      freezesUsed: member.freezesUsed ?? 0,

      maxFreezes: member.maxFreezes ?? 3,

      guestPassesUsed:
        member.guestPassesUsed ?? 0,

      guestPassQuota:
        member.guestPassQuota ?? 0

    };

    this.data.update(items => [
      ...items,
      newMember
    ]);

    return of(newMember);

  }

  update(
    id: string,
    changes: Partial<Member>
  ) {

    let updated!: Member;

    this.data.update(items =>
      items.map(member => {

        if (member.id !== id) {
          return member;
        }

        updated = {
          ...member,
          ...changes
        };

        return updated;

      })
    );

    return of(updated);

  }

}