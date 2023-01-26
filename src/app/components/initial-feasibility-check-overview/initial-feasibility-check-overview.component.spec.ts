import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialFeasibilityCheckOverviewComponent } from './initial-feasibility-check-overview.component';

describe('UseCaseVariantsComponent', () => {
  let component: InitialFeasibilityCheckOverviewComponent;
  let fixture: ComponentFixture<InitialFeasibilityCheckOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InitialFeasibilityCheckOverviewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InitialFeasibilityCheckOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
