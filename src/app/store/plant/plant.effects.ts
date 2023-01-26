import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { UseCaseService } from 'src/app/shared';

import * as PlantActions from './plant.actions';

@Injectable()
export class PlantEffects {
  loadPlants$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlantActions.loadPlants),
      mergeMap(() => this.useCaseService.getPlants()),
      map(plants => PlantActions.loadedPlants({ plants })),
      catchError(error => of(PlantActions.failedLoadingPlants({ error }))),
    ),
  );

  constructor(private actions$: Actions, private useCaseService: UseCaseService) {}
}
