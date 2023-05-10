import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'momentPipe'
})
export class MomentPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    moment.locale('ru');
    return moment.unix(value).calendar();
  }

}
