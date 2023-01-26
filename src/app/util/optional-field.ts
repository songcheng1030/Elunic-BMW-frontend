import {
  AfterContentInit,
  ContentChild,
  Directive,
  ElementRef,
  Input,
  Renderer2,
} from '@angular/core';
import { FormControl, FormControlName } from '@angular/forms';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[optionalField]',
})
export class OptionalFieldDirective implements AfterContentInit {
  @Input()
  optionalField = true;

  @ContentChild(FormControlName)
  controlName!: FormControlName;

  private control!: FormControl;
  private previouslyDisabled = false;

  constructor(private element: ElementRef<HTMLElement>, private renderer: Renderer2) {}

  ngAfterContentInit(): void {
    this.control = this.controlName.control;
    this.previouslyDisabled = this.control.disabled;
  }

  enable(): void {
    if (!this.optionalField) {
      if (!this.previouslyDisabled) {
        this.control.enable();
      }
      this.renderer.removeClass(this.element.nativeElement, 'd-none');
    }
  }

  disable(): void {
    if (!this.optionalField) {
      this.previouslyDisabled = this.control.disabled;
      this.control.disable();
      this.renderer.addClass(this.element.nativeElement, 'd-none');
    }
  }
}
