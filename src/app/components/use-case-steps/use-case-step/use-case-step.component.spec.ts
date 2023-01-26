import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UseCaseStepComponent } from './use-case-step.component';

describe('UseCaseStepComponent', () => {
  let component: UseCaseStepComponent;
  let fixture: ComponentFixture<UseCaseStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UseCaseStepComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UseCaseStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
