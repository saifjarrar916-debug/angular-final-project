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

  create(checkin: Omit<CheckIn, 'id'>) {
    const newCheckIn: CheckIn = { id: `ci${Date.now()}`, ...checkin };
    this.data.update(items => [...items, newCheckIn]);
    this.todayCount.update(value => value + 1);
    return of(newCheckIn);
  }
}
