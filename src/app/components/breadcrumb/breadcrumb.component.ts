import { Component, Input } from '@angular/core';

export interface BreadCrumbSegment {
  name: string;
  link: string[];
  backButton?: boolean;
  translate?: boolean;
}

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent {
  @Input()
  segments: BreadCrumbSegment[] = [];

  getText(str: string) {
    if (str.length > 64) {
      return str.slice(0, 64) + '...';
    }
    return str;
  }
}
