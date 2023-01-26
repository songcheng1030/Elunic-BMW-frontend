import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UseCaseLiveComponent } from './use-case-live.component';

describe('UseCaseLiveComponent', () => {
  let component: UseCaseLiveComponent;
  let fixture: ComponentFixture<UseCaseLiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UseCaseLiveComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UseCaseLiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
