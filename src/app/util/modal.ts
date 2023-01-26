import { Directive } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

interface ModalCloseContext<
  T extends { id: string } | undefined = undefined,
  R extends string = never,
> {
  obj: T;
  mode: 'close' | R;
}

@Directive()
export abstract class ModalDirective<
  C,
  R extends string = never,
  T extends { id: string } | undefined = undefined,
> {
  constructor(public dialogRef: MatDialogRef<C, ModalCloseContext<T, R>>) {}

  abstract canClose(obj: T): Promise<boolean>;
  // abstract canCancel(obj: T): Promise<boolean>;
  // abstract canDelete(obj: T): Promise<boolean>;
  // abstract canSave(obj: T): Promise<boolean>;

  async onClose(obj: T) {
    if (await this.canClose(obj)) {
      this.dialogRef.close({ obj, mode: 'close' });
    }
  }

  // async onCancel(obj: T) {
  //   if (await this.canCancel(obj)) {
  //     this.dialogRef.close();
  //   }
  // }

  // async onDelete(obj: T) {
  //   if (await this.canClose(obj)) {
  //     this.close.emit();
  //   }
  // }

  // async onSave(obj: T) {
  //   if (await this.canCancel(obj)) {
  //     this.cancel.emit();
  //   }
  // }
}
