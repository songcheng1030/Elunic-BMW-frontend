import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UseCaseTestingComponent } from './use-case-testing.component';

describe('UseCaseTestingComponent', () => {
  let component: UseCaseTestingComponent;
  let fixture: ComponentFixture<UseCaseTestingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UseCaseTestingComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UseCaseTestingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
