import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Action, ActionCreator } from '@ngrx/store/src/models';
import { merge, Observable, of } from 'rxjs';
import { map, mapTo, take, tap } from 'rxjs/operators';

import { BaseDto } from '../shared';

export interface ResolverConfig<T extends BaseDto, R> {
  idParam: string;
  loadAction: (id: string) => Action;
  loadedAction: ActionCreator;
  failedAction: ActionCreator;
  mapFn: (res: R) => T;
}

export abstract class NgrxResolver<T extends BaseDto, R> implements Resolve<T | null> {
  constructor(
    private router: Router,
    private store: Store,
    private actions$: Actions,
    private config: ResolverConfig<T, R>,
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<T | null> {
    const id = route.paramMap.get(this.config.idParam);

    if (!id) {
      this.router.navigate(['/']);
      return of(null);
    }

    this.store.dispatch(this.config.loadAction(id));
    const success$ = this.actions$.pipe(ofType(this.config.loadedAction.type));
    const error$ = this.actions$.pipe(
      ofType(this.config.failedAction),
      tap(() => this.router.navigate(['/'])),
      mapTo(null),
    );

    return merge(success$, error$).pipe(
      take(1),
      map(res => {
        if (res) {
          // eslint-disable-next-line  unused-imports/no-unused-vars
          const { type, ...payload } = res;
          return this.config.mapFn(payload as R);
        }
        return res;
      }),
    );
  }
}
