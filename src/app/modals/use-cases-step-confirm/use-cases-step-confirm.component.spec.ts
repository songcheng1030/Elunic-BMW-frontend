import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UseCasesStepConfirmComponent } from './use-cases-step-confirm.component';

describe('UseCasesStepConfirmComponent', () => {
  let component: UseCasesStepConfirmComponent;
  let fixture: ComponentFixture<UseCasesStepConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UseCasesStepConfirmComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UseCasesStepConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
