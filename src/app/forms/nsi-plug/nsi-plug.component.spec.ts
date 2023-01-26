import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NsiPlugComponent } from './nsi-plug.component';

describe('NsiPlugComponent', () => {
  let component: NsiPlugComponent;
  let fixture: ComponentFixture<NsiPlugComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NsiPlugComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NsiPlugComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
