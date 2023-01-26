import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectPlanningGroupComponent } from './project-planning-group.component';

describe('ProjectPlanningGroupComponent', () => {
  let component: ProjectPlanningGroupComponent;
  let fixture: ComponentFixture<ProjectPlanningGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectPlanningGroupComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectPlanningGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
