import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IpsPlcTriggerComponent } from './ips-plc-trigger.component';

describe('IpsPlcTriggerComponent', () => {
  let component: IpsPlcTriggerComponent;
  let fixture: ComponentFixture<IpsPlcTriggerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IpsPlcTriggerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IpsPlcTriggerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
