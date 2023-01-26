import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { distinctUntilChanged, filter, map, startWith, takeUntil } from 'rxjs/operators';
import {
  CameraPositionDefinitionForm,
  ImplementationFeasibilityForm,
  NumberOfTrainingImages,
  UseCaseConfiguratorService,
  Variant,
} from 'src/app/shared';
import { FormDirective } from 'src/app/util';

@Component({
  selector: 'app-camera-position-definition',
  templateUrl: './camera-position-definition.component.html',
  styleUrls: ['./camera-position-definition.component.scss'],
})
export class CameraPositionDefinitionComponent
  extends FormDirective<CameraPositionDefinitionForm>
  implements OnInit
{
  get numberOfTrainingImagesCtrl() {
    return this.getControl('numberOfTrainingImages') as FormControl;
  }

  get additionalLightingNecessaryCtrl() {
    return this.form.get('additionalLightingNecessary') as AbstractControl;
  }

  get cameraNecessaryCtrl() {
    return this.form.get('cameraNecessary') as AbstractControl;
  }

  get edgeDeviceNecessaryCtrl() {
    return this.form.get('edgeDeviceNecessary') as AbstractControl;
  }

  numberOfVariants = 0;
  variants: Variant[] = [];

  constructor(protected fb: FormBuilder, public configurator: UseCaseConfiguratorService) {
    super(fb);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.configurator.register('camera_position_definition', this.form);

    const feasibilityCheck$ = this.configurator
      .getSubStepForm('implementation_feasibility_check')
      .valueChanges.pipe(
        takeUntil(this.destroy$),
        map(
          form => !!(form as ImplementationFeasibilityForm).implementationFeasibilityCheck?.value,
        ),
        distinctUntilChanged(),
      );

    feasibilityCheck$
      .pipe(takeUntil(this.destroy$))
      .subscribe(value =>
        value ||
        (this.configurator.isStepCompleted('offer') && this.configurator.canEditStep('offer'))
          ? this.form.enable()
          : this.form.disable(),
      );

    if (this.configurator.disabledByDecline) {
      this.form.disable();
    }

    this.additionalLightingNecessaryCtrl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        startWith(this.additionalLightingNecessaryCtrl.value),
        filter(value => !!value),
        map(({ value }) => value),
        distinctUntilChanged(),
      )
      .subscribe(value => {
        const ctrl = this.additionalLightingNecessaryCtrl.get('description') as AbstractControl;
        // eslint-disable-next-line  @typescript-eslint/no-unused-expressions
        value ? ctrl.enable() : ctrl.disable();
      });

    this.cameraNecessaryCtrl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        startWith(this.cameraNecessaryCtrl.value),
        filter(value => !!value),
        map(({ value }) => value),
        distinctUntilChanged(),
      )
      .subscribe(value => {
        const definitionOfCameraCtrl = this.cameraNecessaryCtrl.get(
          'definitionOfCamera',
        ) as AbstractControl;
        const cameraHouseNecessaryCtrl = this.cameraNecessaryCtrl.get(
          'cameraHouseNecessary',
        ) as AbstractControl;
        const numberOfCamerasCtrl = this.cameraNecessaryCtrl.get(
          'numberOfCameras',
        ) as AbstractControl;
        const cameraPositionCtrl = this.cameraNecessaryCtrl.get(
          'cameraPosition',
        ) as AbstractControl;
        if (value) {
          definitionOfCameraCtrl.enable();
          cameraHouseNecessaryCtrl.enable();
          numberOfCamerasCtrl.enable();
          cameraPositionCtrl.enable();
        } else {
          definitionOfCameraCtrl.disable();
          cameraHouseNecessaryCtrl.disable();
          numberOfCamerasCtrl.disable();
          cameraPositionCtrl.disable();
        }
      });

    this.edgeDeviceNecessaryCtrl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        startWith(this.edgeDeviceNecessaryCtrl.value),
        filter(value => !!value),
        map(({ value }) => value),
        distinctUntilChanged(),
      )
      .subscribe(value => {
        const definitionOfEdgeDeviceCtrl = this.edgeDeviceNecessaryCtrl.get(
          'definitionOfEdgeDevice',
        ) as AbstractControl;
        const numberOfEdgeDevicesCtrl = this.edgeDeviceNecessaryCtrl.get(
          'numberOfEdgeDevices',
        ) as AbstractControl;
        if (value) {
          definitionOfEdgeDeviceCtrl.enable();
          numberOfEdgeDevicesCtrl.enable();
        } else {
          definitionOfEdgeDeviceCtrl.disable();
          numberOfEdgeDevicesCtrl.disable();
        }
      });

    const { numberOfVariants, variants } = this.configurator.getStep('detailed-request');
    this.numberOfVariants = numberOfVariants ? numberOfVariants : 0;
    this.variants = variants || [];
    this.onChangedNumberOfVariants(this.numberOfVariants);
  }

  protected onChangedNumberOfVariants(number: number) {
    let numberOfTrainingImages = [
      ...this.getControl('numberOfTrainingImages').value,
    ] as NumberOfTrainingImages[];
    const diff = number - numberOfTrainingImages.length;

    if (diff > 0) {
      for (let i = 0; i < diff; i++) {
        numberOfTrainingImages.push({
          trainingImagesForOK: 0,
          trainingImagesForNOK: 0,
        });
      }
    } else {
      const emptyTrainingImagesIndices = this.getEmptyTrainingImagesIndices();
      const countToRemove = Math.min(Math.abs(diff), emptyTrainingImagesIndices.length);
      const indicesToRemove = emptyTrainingImagesIndices.splice(
        emptyTrainingImagesIndices.length - countToRemove,
      );

      const newVariants = [];
      for (let i = 0; i < numberOfTrainingImages.length; i++) {
        if (indicesToRemove.indexOf(i) >= 0) {
          continue;
        }
        newVariants.push(numberOfTrainingImages[i]);
      }
      numberOfTrainingImages = [...newVariants];
    }
    this.getControl('numberOfTrainingImages').setValue(numberOfTrainingImages);
  }

  protected buildForm(): FormGroup {
    return this.fb.group({
      cameraNecessary: this.fb.group({
        value: [null, Validators.required],
        cameraHouseNecessary: [null, Validators.required],
        definitionOfCamera: [null, Validators.required],
        numberOfCameras: [null, [Validators.required, Validators.min(0)]],
        cameraPosition: [null],
      }),
      edgeDeviceNecessary: this.fb.group({
        value: [null, Validators.required],
        definitionOfEdgeDevice: [null, Validators.required],
        numberOfEdgeDevices: [null, [Validators.required, Validators.min(0)]],
      }),
      additionalLightingNecessary: this.fb.group({
        value: [null, Validators.required],
        description: [null],
      }),
      hardwareCostEstimation: [
        null,
        [Validators.required, Validators.min(0), Validators.maxLength(50)],
      ],
      installationCost: [null, [Validators.required, Validators.min(0)]],
      numberOfPicturesTakenPerVehicle: [
        null,
        [Validators.required, Validators.min(0), Validators.maxLength(50)],
      ],
      numberOfTrainingImages: [[]],
    });
  }

  getEmptyTrainingImagesIndices() {
    const variants = [
      ...this.getControl('numberOfTrainingImages').value,
    ] as NumberOfTrainingImages[];
    const indices = [] as number[];

    variants.forEach((variant, i) => {
      if (!variant.trainingImagesForOK && !variant.trainingImagesForNOK) {
        indices.push(i);
      }
    });
    return indices;
  }
}
