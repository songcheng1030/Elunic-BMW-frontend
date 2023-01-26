import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupDetailsOverviewComponent } from './setup-details-overview.component';

describe('SetupDetailsOverviewComponent', () => {
  let component: SetupDetailsOverviewComponent;
  let fixture: ComponentFixture<SetupDetailsOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SetupDetailsOverviewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupDetailsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
