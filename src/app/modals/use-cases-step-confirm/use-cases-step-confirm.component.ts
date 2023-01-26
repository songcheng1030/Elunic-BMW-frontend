import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UseCaseFormStep } from 'src/app/shared';

export type StepConfirm =
  | Exclude<UseCaseFormStep, 'initial-feasibility-check' | 'offer' | 'order' | 'setup-details'>
  | 'offer-accepted'
  | 'offer-declined';

export interface UseCasesStepConfirmModalData {
  type: StepConfirm;
}

interface Template {
  iconUrl: string;
  title: string;
  text: string[];
  subTitle?: string;
  footerText?: string;
}

@Component({
  selector: 'app-use-cases-step-confirm',
  templateUrl: './use-cases-step-confirm.component.html',
  styleUrls: ['./use-cases-step-confirm.component.scss'],
})
export class UseCasesStepConfirmComponent implements OnInit {
  templates: { [key in StepConfirm]?: Template } = {
    'initial-request': {
      iconUrl: 'assets/icons/under_review.svg',
      title: 'MODALS.STEP_SUBMITTED.UNDER_REVIEW',
      subTitle: 'MODALS.STEP_SUBMITTED.INITIAL_FEASIBILITY_CHECK',
      text: [
        'MODALS.STEP_SUBMITTED.INITIAL_REQUEST_TEXT1',
        'MODALS.STEP_SUBMITTED.INITIAL_REQUEST_TEXT2',
        'MODALS.STEP_SUBMITTED.INITIAL_REQUEST_TEXT3',
        'MODALS.STEP_SUBMITTED.AIQX_TEAM',
      ],
      footerText: 'MODALS.STEP_SUBMITTED.MESSAGE_NOTICE',
    },
    'detailed-request': {
      iconUrl: 'assets/icons/under_review.svg',
      title: 'MODALS.STEP_SUBMITTED.UNDER_REVIEW',
      subTitle: 'MODALS.STEP_SUBMITTED.FINAL_FEASIBILITY_CHECK',
      text: [
        'MODALS.STEP_SUBMITTED.DETAILED_REQUEST_TEXT1',
        'MODALS.STEP_SUBMITTED.DETAILED_REQUEST_TEXT2',
        'MODALS.STEP_SUBMITTED.AIQX_TEAM',
      ],
      footerText: 'MODALS.STEP_SUBMITTED.MESSAGE_NOTICE',
    },
    'offer-accepted': {
      iconUrl: 'assets/icons/offer_accepted.png',
      title: 'MODALS.STEP_SUBMITTED.OFFER_ACCEPTED',
      text: [
        'MODALS.STEP_SUBMITTED.OFFER_ACCEPTED_TEXT1',
        'MODALS.STEP_SUBMITTED.OFFER_ACCEPTED_TEXT2',
      ],
      footerText: 'MODALS.STEP_SUBMITTED.MESSAGE_NOTICE',
    },
    'offer-declined': {
      iconUrl: 'assets/icons/offer_declined.png',
      title: 'MODALS.STEP_SUBMITTED.OFFER_DECLINED',
      text: [
        'MODALS.STEP_SUBMITTED.OFFER_DECLINED_TEXT1',
        'MODALS.STEP_SUBMITTED.OFFER_DECLINED_TEXT2',
      ],
    },
  };

  get template() {
    if (!this.data.type) {
      return null;
    }
    let temp: Template | null = null;
    for (const [key, value] of Object.entries(this.templates)) {
      if (key === this.data.type) {
        temp = value || null;
        break;
      }
    }
    return temp;
  }

  constructor(
    public dialogRef: MatDialogRef<UseCasesStepConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UseCasesStepConfirmModalData,
  ) {}

  ngOnInit(): void {}

  async canClose() {
    return true;
  }
}
