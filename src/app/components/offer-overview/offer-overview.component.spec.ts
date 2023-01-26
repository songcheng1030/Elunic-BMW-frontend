import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferOverviewComponent } from './offer-overview.component';

describe('UseCaseVariantsComponent', () => {
  let component: OfferOverviewComponent;
  let fixture: ComponentFixture<OfferOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OfferOverviewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
