import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name:'freezeAllowance',standalone:true,pure:true})
export class FreezeAllowancePipe implements PipeTransform {
  transform(used:number,max:number):string { return `${Math.max(max-used,0)} freeze${Math.max(max-used,0)===1?'':'s'} remaining`; }
}
