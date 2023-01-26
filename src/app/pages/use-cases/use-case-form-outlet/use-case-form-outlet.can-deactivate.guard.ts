import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CanDeactivate } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { ConfirmComponent } from 'src/app/modals/confirm/confirm.component';

import { UseCaseFormOutletComponent } from './use-case-form-outlet.component';

@Injectable({ providedIn: 'root' })
export class UseCaseFormOutletCanDeactivateGuard
  implements CanDeactivate<UseCaseFormOutletComponent>
{
  constructor(private dialog: MatDialog, private translateService: TranslateService) {}

  canDeactivate(component: UseCaseFormOutletComponent): boolean | Observable<boolean> {
    if (!component.canDeactivate()) {
      const dialogRef = this.dialog.open(ConfirmComponent, {
        data: {
          title: this.translateService.instant('MODALS.LEAVE_CONFIRMATION.TITLE'),
          text: this.translateService.instant('MODALS.LEAVE_CONFIRMATION.BODY'),
          confirmText: this.translateService.instant('MODALS.LEAVE_CONFIRMATION.CONFIRM'),
          abortText: this.translateService.instant('MODALS.LEAVE_CONFIRMATION.ABORT'),
          switchBtnColor: true,
        },
      });
      return dialogRef.afterClosed();
    }
    return true;
  }
}
