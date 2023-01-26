import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { NgModel } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-header-search',
  templateUrl: './header-search.component.html',
  styleUrls: ['./header-search.component.scss'],
})
export class HeaderSearchComponent implements AfterViewInit, OnDestroy {
  @Input()
  value = '';

  @Input()
  placeholder = 'Search...';

  @ViewChild(NgModel)
  input!: NgModel;

  @Output()
  search = new EventEmitter<string>();

  destroyed$ = new Subject<void>();

  constructor() {}

  ngAfterViewInit(): void {
    this.input.valueChanges
      ?.pipe(takeUntil(this.destroyed$), debounceTime(250), distinctUntilChanged())
      .subscribe(value => this.search.next(value));
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  reset(e?: Event): void {
    e?.stopPropagation();
    this.value = '';
    this.search.next('');
  }
}
