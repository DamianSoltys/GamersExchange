import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { map, mergeMap, catchError, switchMap } from 'rxjs/operators';
import { decrement, increment } from '../actions/user.action';

@Injectable()
export class UserEffects {
  testEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(increment),
      switchMap(() => of(decrement()))
    )
  );

  constructor(private actions$: Actions) {}
}
