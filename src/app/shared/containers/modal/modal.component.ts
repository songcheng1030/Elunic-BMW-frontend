import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  @Input()
  size?: number;

  get style() {
    const size = Math.max(typeof this.size === 'number' ? this.size : 25, 25);
    const height = this.size ? { 'min-height': size + 'vh' } : {};
    return { 'min-width': size + 'vw', ...height };
  }
}
