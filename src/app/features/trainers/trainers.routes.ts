import { Routes } from '@angular/router';
export const TRAINER_ROUTES:Routes=[
 {path:'',loadComponent:()=>import('./trainers').then(m=>m.Trainers)},
 {path:'new',loadComponent:()=>import('./trainer-details').then(m=>m.TrainerDetails)},
 {path:':id/edit',loadComponent:()=>import('./trainer-details').then(m=>m.TrainerDetails)},
 {path:':id',loadComponent:()=>import('./trainer-details').then(m=>m.TrainerDetails)}
];
