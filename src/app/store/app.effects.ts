import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

@Injectable()
export class AppEffects {
  // eslint-disable-next-line  @typescript-eslint/no-unused-vars
  constructor(private readonly actions$: Actions) {}
}
