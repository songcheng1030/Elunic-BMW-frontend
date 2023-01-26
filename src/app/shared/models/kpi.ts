import * as moment from 'moment';

import { UseCaseFormStep } from './use-case-form-object';

export type StatusKpiDto = Record<Exclude<UseCaseFormStep, 'live'>, number>;

export function roundDuration(minutes: number): number {
  if (minutes === 0) {
    return 0;
  }
  const duration = moment.duration(minutes, 'minutes').asDays();
  return Math.max(Math.round(duration), 1);
}
