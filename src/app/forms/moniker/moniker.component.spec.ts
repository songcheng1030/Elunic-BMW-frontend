import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonikerComponent } from './moniker.component';

describe('MonikerComponent', () => {
  let component: MonikerComponent;
  let fixture: ComponentFixture<MonikerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MonikerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonikerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
