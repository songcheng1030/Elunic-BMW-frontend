import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutputSystemComponent } from './output-system.component';

describe('OutputSystemComponent', () => {
  let component: OutputSystemComponent;
  let fixture: ComponentFixture<OutputSystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OutputSystemComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutputSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
