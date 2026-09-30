import { Routes } from '@angular/router';

export const routes: Routes = [
  { path:'', pathMatch:'full', redirectTo:'dashboard' },
  { path:'dashboard', loadChildren:()=>import('./features/dashboard/dashboard.routes').then(m=>m.DASHBOARD_ROUTES) },
  { path:'members', loadChildren:()=>import('./features/members/members.routes').then(m=>m.MEMBERS_ROUTES) },
  { path:'classes', loadChildren:()=>import('./features/classes/classes.routes').then(m=>m.CLASS_ROUTES) },
  { path:'trainers', loadChildren:()=>import('./features/trainers/trainers.routes').then(m=>m.TRAINER_ROUTES) },
  { path:'plans', loadChildren:()=>import('./features/plans/plans.routes').then(m=>m.PLAN_ROUTES) },
  { path:'**', loadComponent:()=>import('./shared/pages/not-found/not-found').then(m=>m.NotFound) }
];
