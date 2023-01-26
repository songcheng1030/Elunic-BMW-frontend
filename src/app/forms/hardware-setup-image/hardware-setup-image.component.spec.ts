import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HardwareSetupImageComponent } from './hardware-setup-image.component';

describe('HardwareSetupImageComponent', () => {
  let component: HardwareSetupImageComponent;
  let fixture: ComponentFixture<HardwareSetupImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HardwareSetupImageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HardwareSetupImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
