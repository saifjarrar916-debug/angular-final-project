import { Injectable, computed, signal } from '@angular/core';

@Injectable({providedIn:'root'})
export class BranchService {
  private currentBranch=signal('Downtown Branch');
  branch=computed(()=>this.currentBranch());
  setBranch(value:string){this.currentBranch.set(value)}
}
