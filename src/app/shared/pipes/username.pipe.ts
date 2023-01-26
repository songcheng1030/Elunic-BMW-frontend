import { ChangeDetectorRef, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { AuthService } from '../services';

// Cache holding the username for a minute to reduce requests.
// TODO: Cleanup needed.
const TTL = 60 * 1000;
const CACHE = new Map<string, { cachedAt: Date; username?: string }>();

@Pipe({
  name: 'username',
  pure: false,
})
export class UsernamePipe implements PipeTransform, OnDestroy {
  private sub?: Subscription;

  constructor(private authService: AuthService, private cdRef: ChangeDetectorRef) {}

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  transform(value?: string): string {
    if (!value) {
      return '';
    }

    const cachedValue = CACHE.get(value);
    if (cachedValue && cachedValue.cachedAt.getTime() + TTL > Date.now()) {
      return cachedValue.username || '';
    }
    // Set a placeholder so multiple request for the same user are prevented.
    CACHE.set(value, { username: '', cachedAt: new Date() });

    this.sub = this.authService
      .getUser(value)
      .pipe(
        map(user => user.displayName),
        catchError(() => '???'),
      )
      .subscribe(username => {
        CACHE.set(value, { username, cachedAt: new Date() });
        this.cdRef.markForCheck();
      });

    return '';
  }
}
