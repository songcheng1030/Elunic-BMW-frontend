import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UseCaseTrainingImagesComponent } from './use-case-training-images.component';

describe('UseCaseVariantsComponent', () => {
  let component: UseCaseTrainingImagesComponent;
  let fixture: ComponentFixture<UseCaseTrainingImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UseCaseTrainingImagesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UseCaseTrainingImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
