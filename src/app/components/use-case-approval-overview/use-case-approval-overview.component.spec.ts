import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UseCaseApprovalOverviewComponent } from './use-case-approval-overview.component';

describe('UseCaseApprovalComponent', () => {
  let component: UseCaseApprovalOverviewComponent;
  let fixture: ComponentFixture<UseCaseApprovalOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UseCaseApprovalOverviewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UseCaseApprovalOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
