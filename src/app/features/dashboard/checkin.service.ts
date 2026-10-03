import { Injectable, signal } from '@angular/core';
import { of } from 'rxjs';
import { CheckIn } from '../../models/models';
import checkinsData from '../../../assets/data/checkins.json';

@Injectable({ providedIn: 'root' })
export class CheckInService {
  private data = signal<CheckIn[]>([...checkinsData]);
  todayCount = signal(142);

  list() {
    return of(this.data());
  }

  lastVisit(memberName: string): string {
    const name = memberName.trim().toLowerCase();
    const latest = this.data()
      .filter(c => c.memberName.trim().toLowerCase() === name)
      .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time))[0];
    if (!latest) return '—';
    const today = new Date().toISOString().slice(0, 10);
    return `${latest.date === today ? 'Today' : latest.date}, ${latest.time}`;
  }

  create(checkin: Omit<CheckIn, 'id'>) {
    const newCheckIn: CheckIn = { id: `ci${Date.now()}`, ...checkin };
    this.data.update(items => [...items, newCheckIn]);
    this.todayCount.update(value => value + 1);
    return of(newCheckIn);
  }
}
