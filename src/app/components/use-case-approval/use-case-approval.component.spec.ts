import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UseCaseApprovalComponent } from './use-case-approval.component';

describe('UseCaseApprovalComponent', () => {
  let component: UseCaseApprovalComponent;
  let fixture: ComponentFixture<UseCaseApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UseCaseApprovalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UseCaseApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
