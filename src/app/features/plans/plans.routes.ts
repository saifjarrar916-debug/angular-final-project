import { Routes } from '@angular/router';
export const PLAN_ROUTES:Routes=[
 {path:'',loadComponent:()=>import('./plans').then(m=>m.Plans)},
 {path:'new',loadComponent:()=>import('./plan-details').then(m=>m.PlanDetails)},
 {path:':id/edit',loadComponent:()=>import('./plan-details').then(m=>m.PlanDetails)},
 {path:':id',loadComponent:()=>import('./plan-details').then(m=>m.PlanDetails)}
];
