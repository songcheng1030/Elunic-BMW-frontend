import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { UserRole } from 'src/app/shared';

import { AuthService } from './../services/auth.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    // eslint-disable-next-line
    state: RouterStateSnapshot,
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.isActivate(next.data.roles);
  }

  isActivate(roles: UserRole[]): boolean {
    if (roles.includes(this.authService.role)) {
      return true;
    }
    return false;
  }
}
