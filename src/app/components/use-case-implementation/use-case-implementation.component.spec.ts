import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UseCaseImplementationComponent } from './use-case-implementation.component';

describe('UseCaseImplementationComponent', () => {
  let component: UseCaseImplementationComponent;
  let fixture: ComponentFixture<UseCaseImplementationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UseCaseImplementationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UseCaseImplementationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
