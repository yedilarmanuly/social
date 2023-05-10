import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'showWords'
})
export class ShowWordsPipe implements PipeTransform {
  transform(value: string[], ...args: any[]): any {
    console.log(value);
    return value.join(',');
  }
}
