import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedRequestOverviewComponent } from './detailed-request-overview.component';

describe('UseCaseVariantsComponent', () => {
  let component: DetailedRequestOverviewComponent;
  let fixture: ComponentFixture<DetailedRequestOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailedRequestOverviewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedRequestOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
