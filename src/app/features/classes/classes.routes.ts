import { Routes } from '@angular/router';
export const CLASS_ROUTES:Routes=[
 {path:'',loadComponent:()=>import('./classes').then(m=>m.Classes)},
 {path:'new',loadComponent:()=>import('./class-details').then(m=>m.ClassDetails)},
 {path:':id/book',loadComponent:()=>import('./book-session').then(m=>m.BookSession)},
 {path:':id/edit',loadComponent:()=>import('./class-details').then(m=>m.ClassDetails)},
 {path:':id',loadComponent:()=>import('./class-details').then(m=>m.ClassDetails)}
];
