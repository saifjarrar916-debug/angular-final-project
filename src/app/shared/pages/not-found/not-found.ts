import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({standalone:true,imports:[RouterLink],template:`<div class="page empty"><h1>404</h1><p>The page was not found.</p><a class="btn primary" routerLink="/dashboard">Back to Dashboard</a></div>`})
export class NotFound {}
