import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UseCaseFormOutletComponent } from './use-case-form-outlet.component';

describe('UseCaseFormOutletComponent', () => {
  let component: UseCaseFormOutletComponent;
  let fixture: ComponentFixture<UseCaseFormOutletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UseCaseFormOutletComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UseCaseFormOutletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
