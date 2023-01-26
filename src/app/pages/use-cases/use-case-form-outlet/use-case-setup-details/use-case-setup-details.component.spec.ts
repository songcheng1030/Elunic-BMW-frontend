import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UseCaseSetupDetailsComponent } from './use-case-setup-details.component';

describe('UseCaseSetupDetailsComponent', () => {
  let component: UseCaseSetupDetailsComponent;
  let fixture: ComponentFixture<UseCaseSetupDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UseCaseSetupDetailsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UseCaseSetupDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
