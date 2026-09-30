import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { NewCheckinDialog } from './shared/components/new-checkin-dialog/new-checkin-dialog';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

@Component({
  selector:'app-root',
  standalone:true,
  imports:[RouterOutlet,RouterLink,RouterLinkActive,FormsModule],
  template:`
  <div class="shell">
    <aside class="sidebar">
      <div class="brand"><div class="brand-mark">✦</div><div><b>Titan Fitness</b><small>STAFF PORTAL</small></div></div>
      <button class="checkin-btn" (click)="openCheckin()">＋ New Check-in</button>
      <nav>
        <a routerLink="/dashboard" routerLinkActive="selected">▦ <span>Dashboard</span></a>
        <a routerLink="/members" routerLinkActive="selected">♙ <span>Members</span></a>
        <a routerLink="/classes" routerLinkActive="selected">⚒ <span>Classes</span></a>
        <a routerLink="/trainers" routerLinkActive="selected">♟ <span>Trainers</span></a>
        <a routerLink="/plans" routerLinkActive="selected">▤ <span>Plans</span></a>
      </nav>
    </aside>
    <main class="main">
      <header class="topbar">
        <div class="branch">Downtown Branch</div>
       <input
  class="global-search"
  placeholder="Search members, classes..."
  aria-label="Global search"
  [(ngModel)]="searchText"
  (ngModelChange)="searchPage($event)"
>
        <div class="top-icons">♧　□　●</div>
      </header>
      <router-outlet />
    </main>
  </div>
  `,
  styles:[`
    .shell{min-height:100vh;display:flex}.sidebar{width:220px;background:#062c78;color:#fff;position:fixed;inset:0 auto 0 0;padding:18px 12px}
    .brand{display:flex;gap:10px;align-items:center;padding:5px 8px 20px}.brand-mark{font-size:22px}.brand b{display:block;font-size:15px}.brand small{display:block;font-size:8px;opacity:.75;letter-spacing:1px;margin-top:2px}
    .checkin-btn{width:100%;background:#fff;color:#062c78;border:0;padding:10px;border-radius:2px;font-weight:700;margin-bottom:20px}
    nav{display:flex;flex-direction:column;gap:3px}nav a{padding:12px 10px;border-radius:2px;display:flex;gap:10px;font-size:13px}nav a.selected{background:#214d9b}nav a:hover{background:#17428e}
    .main{margin-left:220px;width:calc(100% - 220px);min-height:100vh}.topbar{height:58px;background:#fff;border-bottom:1px solid #e3e7ee;display:flex;align-items:center;padding:0 24px;gap:28px}
    .branch{font-weight:700;color:#16366f}.global-search{width:280px;border:1px solid #e3e7ee;background:#f7f8fa;padding:9px 12px;border-radius:3px}.top-icons{margin-left:auto;color:#687285}
    @media(max-width:750px){.sidebar{width:70px}.brand div:not(.brand-mark),.checkin-btn,nav span{display:none}.main{margin-left:70px;width:calc(100% - 70px)}.global-search{width:160px}}
    .search-highlight{
  background:yellow;
  color:#000;
  padding:1px 2px;
  border-radius:2px;
}
  `]
})
export class App {
  private dialog = inject(MatDialog);
  openCheckin(){ this.dialog.open(NewCheckinDialog,{width:'650px'}); }
  searchText = '';

searchPage(text: string) {

  // إزالة الـ highlights القديمة
  document.querySelectorAll('.search-highlight').forEach(el => {
    el.replaceWith(document.createTextNode(el.textContent || ''));
  });

  text = text.trim().toLowerCase();

  if (!text) {
    return;
  }

  const root =
    document.querySelector('.main') || document.body;

  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT
  );

  const nodes: Text[] = [];

  while (walker.nextNode()) {

    const node = walker.currentNode as Text;

    if (
      node.parentElement &&
      !['SCRIPT', 'STYLE', 'INPUT', 'TEXTAREA'].includes(
        node.parentElement.tagName
      ) &&
      node.textContent?.toLowerCase().includes(text)
    ) {
      nodes.push(node);
    }

  }

  nodes.forEach(node => {

    const content = node.textContent || '';

    const escapedText =
      text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const regex = new RegExp(
      `(${escapedText})`,
      'gi'
    );

    const fragment = document.createDocumentFragment();

    let lastIndex = 0;

    content.replace(
      regex,
      (match, _group, offset) => {

        fragment.appendChild(
          document.createTextNode(
            content.slice(lastIndex, offset)
          )
        );

        const mark = document.createElement('mark');

        mark.className = 'search-highlight';

        mark.textContent = match;

        fragment.appendChild(mark);

        lastIndex = offset + match.length;

        return match;
      }
    );

    fragment.appendChild(
      document.createTextNode(
        content.slice(lastIndex)
      )
    );

    node.replaceWith(fragment);

  });

}
}
