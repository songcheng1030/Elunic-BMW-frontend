import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UseCaseVariantsComponent } from './use-case-variants.component';

describe('UseCaseVariantsComponent', () => {
  let component: UseCaseVariantsComponent;
  let fixture: ComponentFixture<UseCaseVariantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UseCaseVariantsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UseCaseVariantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
