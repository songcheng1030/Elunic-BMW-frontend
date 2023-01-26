import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AuthService, UserRole } from '../shared';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[requiredRole]',
})
export class UserRoleDirective implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @Input()
  requiredRole!: UserRole;

  constructor(private elementRef: ElementRef, private authService: AuthService) {}

  ngOnInit(): void {
    this.elementRef.nativeElement.style.display = 'none';
    this.checkAccess();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  checkAccess() {
    this.authService.role$
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        role =>
          (this.elementRef.nativeElement.style.display = role === this.requiredRole ? '' : 'none'),
      );
  }
}
