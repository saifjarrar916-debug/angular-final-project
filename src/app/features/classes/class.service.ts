import { Injectable, signal } from '@angular/core';
import { of } from 'rxjs';
import { FitnessClass } from '../../models/models';
import classesData from '../../../assets/data/classes.json';

@Injectable({
  providedIn: 'root'
})
export class ClassService {

  data = signal<FitnessClass[]>(
    classesData.map(c => ({
      ...c,
      status: c.status as FitnessClass['status']
    }))
  );

  load() {

    this.data.set(
      classesData.map(c => ({
        ...c,
        status: c.status as FitnessClass['status']
      }))
    );

  }

  list() {

    return of(this.data());

  }

  get(id: string) {

    return of(
      this.data().find(c => c.id === id)!
    );

  }

  create(c: Partial<FitnessClass>) {

    const newClass: FitnessClass = {

      id: `c${Date.now()}`,

      name: c.name ?? 'New Class',

      branch: c.branch ?? 'Downtown Branch',

      trainer: c.trainer ?? '',

      studio: c.studio ?? '',

      date: c.date ?? '',

      startTime: c.startTime ?? '',

      capacity: c.capacity ?? 20,

      duration: c.duration ?? 60,

      status: c.status ?? 'Upcoming',

      description: c.description ?? '',

      enrolled: c.enrolled ?? 0,

      waitlist: c.waitlist ?? 0

    };

    this.data.update(items => [
      ...items,
      newClass
    ]);

    return of(newClass);

  }

  update(id: string, changes: Partial<FitnessClass>) {

    let updated!: FitnessClass;

    this.data.update(items =>
      items.map(c => {

        if (c.id !== id) {
          return c;
        }

        updated = {
          ...c,
          ...changes
        };

        return updated;

      })
    );

    return of(updated);

  }

}