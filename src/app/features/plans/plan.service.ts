import { Injectable, signal } from '@angular/core';
import { of } from 'rxjs';
import { Plan, ApiList } from '../../models/models';
import plansData from '../../../assets/data/plans.json';

@Injectable({ providedIn: 'root' })
export class PlanService {
  private data = signal<Plan[]>([...plansData]);
  page = signal(1);
  pageSize = signal(5);
  search = signal('');
  duration = signal('');
  access = signal('');
  status = signal('');

  list() {
    const search = this.search().toLowerCase().trim();
    const filtered = this.data().filter(plan =>
      (!search || plan.name.toLowerCase().includes(search)) &&
      (!this.duration() || String(plan.durationMonths) === this.duration()) &&
      (!this.access() || plan.accessScope === this.access()) &&
      (!this.status() || (this.status() === 'Published' ? plan.isPublished : !plan.isPublished))
    );
    const start = (this.page() - 1) * this.pageSize();
    return of<ApiList<Plan>>({ items: filtered.slice(start, start + this.pageSize()), total: filtered.length });
  }

  get(id: string) {
    return of(this.data().find(plan => plan.id === id)!);
  }

  create(p: Partial<Plan>) {
    const newPlan: Plan = {
      id: `p${Date.now()}`, name: p.name ?? '', price: p.price ?? 0,
      durationMonths: p.durationMonths ?? 1, isPublished: p.isPublished ?? false,
      maxFreezeDays: p.maxFreezeDays ?? 0, maxFreezes: p.maxFreezes ?? 0,
      guestPassQuota: p.guestPassQuota ?? 0, accessScope: p.accessScope ?? 'All Branches'
    };
    this.data.update(items => [...items, newPlan]);
    return of(newPlan);
  }

  update(id: string, changes: Partial<Plan>) {
    let updated!: Plan;
    this.data.update(items => items.map(plan => {
      if (plan.id !== id) return plan;
      updated = { ...plan, ...changes };
      return updated;
    }));
    return of(updated);
  }
}
