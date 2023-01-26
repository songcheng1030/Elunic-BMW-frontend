import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {
  PaginationParams,
  PagingResponseMeta,
  Sorting,
  UseCaseDto,
  UseCaseFilter,
} from '../shared';
import { State, UseCase } from '../store';

const DEFAULT_PAGE_PARAMS: PaginationParams = {
  page: 1,
  limit: 10,
};

export abstract class TableDataSource<T> extends MatTableDataSource<T> {
  protected destroy$ = new Subject<void>();

  protected sorting?: Sorting;
  pageParams: PaginationParams = { ...DEFAULT_PAGE_PARAMS };
  pageResMeta: PagingResponseMeta = {
    count: 0,
    total: 0,
    page: 0,
    pageCount: 0,
  };

  constructor(
    readonly dataChange: Observable<T[]>,
    meta$: Observable<Partial<{ paging: Partial<PagingResponseMeta>; sorting?: Sorting }>>,
  ) {
    super();
    this.dataChange.pipe(takeUntil(this.destroy$)).subscribe(data => (this.data = data));

    meta$.pipe(takeUntil(this.destroy$)).subscribe(({ paging, sorting }) => {
      this.pageResMeta = { ...this.pageResMeta, ...paging };
      this.sorting = sorting || this.sorting;
    });
  }

  protected abstract loadPage(params: PaginationParams, sort?: Sorting): void;

  set paginator(paginator: MatPaginator) {
    super.paginator = paginator;
    paginator.page.pipe(takeUntil(this.destroy$)).subscribe(({ pageIndex, pageSize }) => {
      this.pageParams = { ...this.pageParams, page: pageIndex + 1, limit: pageSize };
      this.loadPage(this.pageParams, this.sorting);
    });
  }

  set sort(sort: MatSort) {
    super.sort = sort;
    sort.sortChange.pipe(takeUntil(this.destroy$)).subscribe(({ active, direction }) => {
      this.sorting = direction ? [active, direction] : undefined;
      this.pageParams = { ...this.pageParams, page: 1 };
      if (this.paginator) {
        this.paginator.pageIndex = 0;
      }
      this.loadPage(this.pageParams, this.sorting);
    });
  }

  disconnect() {
    super.disconnect();
    this.destroy$.next();
    this.destroy$.complete();
  }

  resetPage() {
    this.pageParams = { ...DEFAULT_PAGE_PARAMS };
  }
}

export class UseCaseTableDataSource extends TableDataSource<UseCaseDto> {
  private lastFilter: UseCaseFilter = {};

  constructor(protected store: Store<State>, public tableId: string) {
    super(
      store.select(UseCase.selectTableItems(tableId)),
      store.select(UseCase.selectTableMeta(tableId)),
    );
  }

  loadUseCases(filter?: UseCaseFilter, sorting?: Sorting) {
    this.sorting = sorting || this.sorting;
    this.lastFilter = filter || this.lastFilter;
    this.store.dispatch(
      UseCase.loadUseCasesTable({
        tableId: this.tableId,
        filter: { ...this.lastFilter, ...this.pageParams },
        sorting: this.sorting,
      }),
    );
  }

  loadPage(params: PaginationParams, sorting?: Sorting) {
    this.sorting = sorting || this.sorting;
    this.store.dispatch(
      UseCase.loadUseCasesTable({
        tableId: this.tableId,
        sorting,
        filter: { ...this.lastFilter, ...params },
      }),
    );
  }

  disconnect() {
    this.store.dispatch(UseCase.removeUseCaseTable({ tableId: this.tableId }));
    super.disconnect();
  }
}
