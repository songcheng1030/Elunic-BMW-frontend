import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureDefinitionComponent } from './feature-definition.component';

describe('FeatureDefinitionComponent', () => {
  let component: FeatureDefinitionComponent;
  let fixture: ComponentFixture<FeatureDefinitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FeatureDefinitionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatureDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
