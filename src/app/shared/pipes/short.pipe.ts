import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'short',
})
export class ShortPipe implements PipeTransform {
  constructor(@Inject(LOCALE_ID) private locale: string) {}

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  transform(value: any, locale?: string): string {
    const m = moment(value);
    if (!m.isValid()) {
      return '';
    }

    return m.format((locale || this.locale) === 'de' ? 'DD.MM.YYYY, HH:mm' : 'MM/DD/YYYY, hh:mm a');
  }
}
