import { Component, HostListener, inject, signal } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { NewCheckinDialog } from './shared/components/new-checkin-dialog/new-checkin-dialog';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { ToastService } from './shared/services/toast.service';

@Component({
  selector:'app-root',
  standalone:true,
  imports:[RouterOutlet,RouterLink,RouterLinkActive,FormsModule],
  template:`
  <div class="shell">
    @if (menuOpen()) { <div class="backdrop" (click)="menuOpen.set(false)"></div> }
    <aside class="sidebar" [class.open]="menuOpen()">
      <a routerLink="/dashboard" class="brand" (click)="menuOpen.set(false)" aria-label="Titan Fitness dashboard"><div class="brand-mark">✦</div><div><b>Titan Fitness</b><small>STAFF PORTAL</small></div></a>
      <button type="button" class="checkin-btn" aria-label="New check-in" (click)="openCheckin()"><span>＋</span> <span class="label">New Check-in</span></button>
      <nav aria-label="Main navigation" (click)="menuOpen.set(false)">
        <a routerLink="/dashboard" routerLinkActive="selected">▦ <span>Dashboard</span></a>
        <a routerLink="/members" routerLinkActive="selected">♙ <span>Members</span></a>
        <a routerLink="/classes" routerLinkActive="selected">⚒ <span>Classes</span></a>
        <a routerLink="/trainers" routerLinkActive="selected">♟ <span>Trainers</span></a>
        <a routerLink="/plans" routerLinkActive="selected">▤ <span>Plans</span></a>
      </nav>
    </aside>
    <main class="main">
      <header class="topbar">
        <button type="button" class="menu-btn" aria-label="Toggle menu" [attr.aria-expanded]="menuOpen()" (click)="menuOpen.set(!menuOpen())"><span></span><span></span><span></span></button>
        <div class="branch">Downtown Branch</div>
       <input
  class="global-search"
  placeholder="Search members, classes..."
  aria-label="Global search"
  [(ngModel)]="searchText"
  (ngModelChange)="onSearchInput($event)"
>
        <div class="top-icons" aria-hidden="true">♧　□　●</div>
      </header>
      <router-outlet />
    </main>
  </div>
  <div class="toast-region" aria-live="polite">
    @if (toast.message()) { <div class="toast">{{ toast.message() }}</div> }
  </div>
  `,
  styles:[`
    .shell{min-height:100vh;display:flex}.sidebar{width:220px;background:#062c78;color:#fff;position:fixed;inset:0 auto 0 0;padding:18px 12px}
    .brand{display:flex;gap:10px;align-items:center;padding:5px 8px 20px}.brand-mark{font-size:22px}.brand b{display:block;font-size:15px}.brand small{display:block;font-size:8px;opacity:.75;letter-spacing:1px;margin-top:2px}
    .checkin-btn{width:100%;background:#fff;color:#062c78;border:0;padding:10px;border-radius:2px;font-weight:700;margin-bottom:20px}
    nav{display:flex;flex-direction:column;gap:3px}nav a{padding:12px 10px;border-radius:2px;display:flex;gap:10px;font-size:13px}nav a.selected{background:#214d9b}nav a:hover{background:#17428e}
    .main{margin-left:220px;width:calc(100% - 220px);min-height:100vh}.topbar{height:58px;background:#fff;border-bottom:1px solid #e3e7ee;display:flex;align-items:center;padding:0 24px;gap:28px}
    .branch{font-weight:700;color:#16366f}.global-search{width:280px;border:1px solid #e3e7ee;background:#f7f8fa;padding:9px 12px;border-radius:3px}.top-icons{margin-left:auto;color:#687285}
    .checkin-btn:hover{background:#e8eefb}nav a,.checkin-btn{transition:background .15s}.sidebar a:focus-visible,.checkin-btn:focus-visible{outline:2px solid #fff}
    .toast-region{position:fixed;right:20px;bottom:20px;z-index:2000}.toast{background:#172033;color:#fff;padding:12px 18px;border-radius:6px;font-size:13px;box-shadow:0 6px 20px rgba(0,0,0,.25)}
    .menu-btn{display:none;background:none;border:0;padding:8px;margin-left:-8px;border-radius:4px}.menu-btn span{display:block;width:22px;height:2px;background:#16366f;margin:5px 0}.menu-btn:hover{background:#f0f3f9}.backdrop{display:none}
    @media(max-width:750px){.menu-btn{display:block}.sidebar{transform:translateX(-100%);transition:transform .25s ease;z-index:1100;box-shadow:none}.sidebar.open{transform:none;box-shadow:4px 0 24px rgba(0,0,0,.25)}.backdrop{display:block;position:fixed;inset:0;background:rgba(10,20,40,.45);z-index:1050}.main{margin-left:0;width:100%}.topbar{padding:0 16px;gap:14px}.global-search{width:100%;max-width:240px}.branch{display:none}.top-icons{display:none}}
  `]
})
export class App {
  private dialog = inject(MatDialog);
  openCheckin(){ this.menuOpen.set(false); this.dialog.open(NewCheckinDialog,{width:'650px'}); }
  toast = inject(ToastService);
  menuOpen = signal(false);

  @HostListener('document:keydown.escape')
  closeMenu() { this.menuOpen.set(false); }
  searchText = '';
  private searchTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    inject(Router).events
      .pipe(filter(e => e instanceof NavigationEnd), takeUntilDestroyed())
      .subscribe(() => setTimeout(() => this.searchPage(this.searchText), 0));
  }

  onSearchInput(text: string) {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => this.searchPage(text), 250);
  }

searchPage(text: string) {
  const registry = (CSS as any).highlights;

  if (!registry) {
    return;
  }

  registry.delete('search-highlight');

  const query = text.trim().toLowerCase();
  const root = document.querySelector('.main');

  if (!query || !root) {
    return;
  }

  const ranges: Range[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);

  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    const tag = node.parentElement?.tagName;

    if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'TEXTAREA') {
      continue;
    }

    const content = (node.textContent || '').toLowerCase();
    let index = content.indexOf(query);

    while (index !== -1) {
      const range = new Range();
      range.setStart(node, index);
      range.setEnd(node, index + query.length);
      ranges.push(range);
      index = content.indexOf(query, index + query.length);
    }
  }

  registry.set('search-highlight', new (window as any).Highlight(...ranges));
}
}