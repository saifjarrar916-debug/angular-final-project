import { Routes } from '@angular/router';
export const MEMBERS_ROUTES:Routes=[
 {path:'',loadComponent:()=>import('./members').then(m=>m.Members)},
 {path:':id/freeze',loadComponent:()=>import('./freeze-membership').then(m=>m.FreezeMembership)},
 {path:':id',loadComponent:()=>import('./member-profile').then(m=>m.MemberProfile)}
];
