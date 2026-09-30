export type Status = 'Active' | 'Frozen' | 'Expired';
export type ClassState = 'Upcoming' | 'Active' | 'Full' | 'Completed' | 'Cancelled';

export interface Member {
  id: string; name: string; branch: string; status: Status; joinedDate: string;
  email: string; phone: string; address: string; planName: string; planPrice: number;
  planEndDate: string; freezesUsed: number; maxFreezes: number;
  guestPassesUsed: number; guestPassQuota: number;
}
export interface CheckIn { id:string; memberId:string; memberName:string; date:string; time:string; branch:string; notes:string; }
export interface FitnessClass {
  id:string; name:string; branch:string; trainer:string; studio:string; date:string;
  startTime:string; capacity:number; duration:number; status:ClassState; description:string;
  enrolled:number; waitlist:number;
}
export interface Trainer {
  id:string; name:string; specialty:string; branch:string; email:string; phone:string; isActive:boolean;
}
export interface Plan {
  id:string; name:string; price:number; durationMonths:number; isPublished:boolean;
  maxFreezeDays:number; maxFreezes:number; guestPassQuota:number; accessScope:string;
}
export interface Filters { search:string; branch:string; status:string; specialty:string; duration:string; access:string; }
export interface ApiList<T> { items:T[]; total:number; }
