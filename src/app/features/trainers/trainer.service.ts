import { Injectable, signal } from '@angular/core';
import { of } from 'rxjs';
import { Trainer, ApiList } from '../../models/models';
import trainersData from '../../../assets/data/trainers.json';

@Injectable({ providedIn: 'root' })
export class TrainerService {
  private data = signal<Trainer[]>([...trainersData]);
  page = signal(1);
  pageSize = signal(5);
  search = signal('');
  branch = signal('');
  specialty = signal('');
  status = signal('');

  list() {
    const search = this.search().toLowerCase().trim();
    const filtered = this.data().filter(trainer =>
      (!search || trainer.name.toLowerCase().includes(search) || trainer.email.toLowerCase().includes(search)) &&
      (!this.branch() || trainer.branch === this.branch()) &&
      (!this.specialty() || trainer.specialty === this.specialty()) &&
      (!this.status() || (this.status() === 'Active' ? trainer.isActive : !trainer.isActive))
    );
    const start = (this.page() - 1) * this.pageSize();
    return of<ApiList<Trainer>>({ items: filtered.slice(start, start + this.pageSize()), total: filtered.length });
  }

  get(id: string) {
    return of(this.data().find(trainer => trainer.id === id)!);
  }

  create(t: Partial<Trainer>) {
    const newTrainer: Trainer = {
      id: `t${Date.now()}`, name: t.name ?? '', specialty: t.specialty ?? '',
      branch: t.branch ?? 'Downtown Branch', email: t.email ?? '', phone: t.phone ?? '',
      isActive: t.isActive ?? true
    };
    this.data.update(items => [...items, newTrainer]);
    return of(newTrainer);
  }

  update(id: string, changes: Partial<Trainer>) {
    let updated!: Trainer;
    this.data.update(items => items.map(trainer => {
      if (trainer.id !== id) return trainer;
      updated = { ...trainer, ...changes };
      return updated;
    }));
    return of(updated);
  }
}
