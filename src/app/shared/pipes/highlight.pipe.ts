import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name:'highlight',standalone:true,pure:true})
export class HighlightPipe implements PipeTransform {
  transform(value:string, term:string):string {
    if(!term) return value;
    const safe=term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    return value.replace(new RegExp(`(${safe})`,'ig'),'<mark>$1</mark>');
  }
}
