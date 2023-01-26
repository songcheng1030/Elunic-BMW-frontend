import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialRequestOverviewComponent } from './initial-request-overview.component';

describe('UseCaseVariantsComponent', () => {
  let component: InitialRequestOverviewComponent;
  let fixture: ComponentFixture<InitialRequestOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InitialRequestOverviewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InitialRequestOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
