import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'shortTime',
})
export class ShortTimePipe implements PipeTransform {
  constructor(@Inject(LOCALE_ID) private locale: string) {}

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  transform(value: any, locale?: string): string | null {
    return moment(value).format((locale || this.locale) === 'de' ? 'HH:mm' : 'hh:mm a');
  }
}
