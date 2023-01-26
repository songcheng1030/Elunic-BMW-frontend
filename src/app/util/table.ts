import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AfterViewInit, Directive, Injector } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

export type Column<T extends string = string> = ColumnWithBreakpoint<T> | T;

export interface ColumnWithBreakpoint<T extends string> {
  name: T;
  breakpoints: (keyof typeof Breakpoints | string)[];
}

@Directive()
export abstract class TableDirective<T> implements AfterViewInit {
  private columns$ = new BehaviorSubject<Column[]>([]);
  private breakpointObserver: BreakpointObserver;

  set columns(columns: Column[]) {
    this.columns$.next(columns);
  }

  set data(data: T[]) {
    this.fillTable(data || []);
  }

  get isEmpty() {
    return !this.dataSource.data.length;
  }

  protected sortingDataAccessor?: (data: T, sortHeaderId: string) => string | number;
  protected filterPredicate?: (data: T, filter: string) => boolean;
  protected sort?: MatSort;
  protected paginator?: MatPaginator;

  visibleColumns$ = this.columns$.pipe(
    switchMap(columns =>
      combineLatest(columns.map(col => this.getMatcher(col))).pipe(
        map(cols => cols.filter(col => col.display).map(col => col.name)),
      ),
    ),
  );

  abstract readonly dataSource: MatTableDataSource<T>;

  constructor(protected injector: Injector, columns: Column[]) {
    this.breakpointObserver = injector.get(BreakpointObserver);
    this.columns = columns;
  }

  ngAfterViewInit() {
    if (!this.dataSource.sort && this.sort) {
      this.dataSource.sort = this.sort;
      if (this.sortingDataAccessor) {
        this.dataSource.sortingDataAccessor = this.sortingDataAccessor;
      }
    }
    if (this.filterPredicate) {
      this.dataSource.filterPredicate = this.filterPredicate;
    }
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  fillTable(data: T[]) {
    this.dataSource.data = data;
  }

  sortTable(sortable: MatSortable) {
    if (this.sort) {
      this.sort.sort(sortable);
    }
  }

  private getMatcher(col: Column): Observable<{ name: string; display: boolean }> {
    if (typeof col === 'string') {
      return of({ name: col, display: true });
    }
    return this.breakpointObserver
      .observe(col.breakpoints.map(bp => Breakpoints[bp as keyof typeof Breakpoints] || bp))
      .pipe(map(state => ({ name: col.name, display: state.matches })));
  }
}
