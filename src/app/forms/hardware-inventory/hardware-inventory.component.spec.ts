import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HardwareInventoryComponent } from './hardware-inventory.component';

describe('HardwareInventoryComponent', () => {
  let component: HardwareInventoryComponent;
  let fixture: ComponentFixture<HardwareInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HardwareInventoryComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HardwareInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
