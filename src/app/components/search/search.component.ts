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
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements AfterViewInit, OnDestroy {
  @Input() value = '';
  @Input() placeholder = 'Search...';
  @ViewChild(NgModel) input!: NgModel;
  @Output() search = new EventEmitter<string>();
  destroyed$ = new Subject<boolean>();

  ngAfterViewInit(): void {
    this.input.valueChanges
      ?.pipe(takeUntil(this.destroyed$), debounceTime(250), distinctUntilChanged())
      .subscribe(value => this.search.next(value));
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
  }
}
