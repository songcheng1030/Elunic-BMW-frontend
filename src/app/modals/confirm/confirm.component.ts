import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface ConfirmModalData {
  title: string;
  text: string;
  confirmText: string;
  abortText: string;
  hideAbort?: boolean;
  switchBtnColor?: boolean;
}

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss'],
})
export class ConfirmComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmModalData,
  ) {}

  ngOnInit(): void {}

  async canClose() {
    return true;
  }
}
