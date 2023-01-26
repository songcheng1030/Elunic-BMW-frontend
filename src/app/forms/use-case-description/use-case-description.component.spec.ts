import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UseCaseDescriptionComponent } from './use-case-description.component';

describe('UseCaseDescriptionComponent', () => {
  let component: UseCaseDescriptionComponent;
  let fixture: ComponentFixture<UseCaseDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UseCaseDescriptionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UseCaseDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
