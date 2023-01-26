import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostEstimationComponent } from './cost-estimation.component';

describe('CostEstimationComponent', () => {
  let component: CostEstimationComponent;
  let fixture: ComponentFixture<CostEstimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CostEstimationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CostEstimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
