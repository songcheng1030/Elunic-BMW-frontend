import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UseCaseStepsComponent } from './use-case-steps.component';

describe('UseCaseStepsComponent', () => {
  let component: UseCaseStepsComponent;
  let fixture: ComponentFixture<UseCaseStepsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UseCaseStepsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UseCaseStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
