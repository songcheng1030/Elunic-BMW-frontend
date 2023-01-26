import { Dictionary, EntityState } from '@ngrx/entity';
import { createSelector, MemoizedSelector } from '@ngrx/store';
import { BaseDto, PagingResponseMeta, Sorting } from 'src/app/shared';

type TableDictionary<T extends BaseDto, R> = Dictionary<SingleTableState<T, R>>;

interface TableMeta<T> {
  filter: T;
  paging: Partial<PagingResponseMeta & { limit: number }>;
  sorting?: Sorting;
}

export interface SingleTableState<T extends BaseDto, R> extends TableMeta<R> {
  items: T[];
}

export interface TableState<T extends BaseDto, R> {
  tables: TableDictionary<T, R>;
  tableIds: string[];
}

type UpsertManyFn<T extends BaseDto> = <S extends EntityState<T>>(entities: T[], state: S) => S;

export function upsertManyAndTable<T extends BaseDto, R>(
  upsertMany: UpsertManyFn<T>,
  state: EntityState<T> & TableState<T, R>,
  table: SingleTableState<T, R>,
  id?: string,
) {
  // TODO: This might introduce non deterministic behavior.
  const tableId = id || state.tableIds[0];
  if (!tableId) {
    return upsertMany(table.items, state);
  }
  const tables = { ...state.tables, [tableId]: table };
  const tableIds = Array.from(new Set([...state.tableIds, tableId]));
  return upsertMany(table.items, { ...state, tables, tableIds });
}

export function removeTable<T extends BaseDto, R, S extends TableState<T, R> = TableState<T, R>>(
  id: string,
  state: S,
): S {
  const tableIds = state.tableIds.filter(key => key !== id);
  const tables = tableIds.reduce((prev, key) => {
    return {
      ...prev,
      [key]: state.tables[key],
    };
  }, {} as TableDictionary<T, R>);
  return { ...state, tables, tableIds };
}

export function createTableSelectors<
  T extends BaseDto,
  R,
  S extends TableState<T, R> = TableState<T, R>,
>(featureSelector: MemoizedSelector<object, S>) {
  const selectTable = (id?: string) =>
    createSelector(featureSelector, state => {
      if (!id) {
        // TODO: This might introduce non deterministic behavior.
        id = state.tableIds[0];
      }
      return id ? state.tables[id] : undefined;
    });
  return {
    selectTableState: (id?: string) =>
      createSelector(selectTable(id), state => (state ? state : ({} as SingleTableState<T, R>))),
    selectTableItems: (id?: string) =>
      createSelector(selectTable(id), state => (state ? state.items : ([] as T[]))),
    selectTableFilter: (id?: string) =>
      createSelector(selectTable(id), state => (state ? state.filter : ({} as R))),
    selectTableMeta: (id?: string) =>
      createSelector(selectTable(id), state =>
        state
          ? {
              filter: state.filter,
              paging: { ...state.paging, limit: state.paging.limit || 25 },
              sorting: state.sorting,
            }
          : ({ filter: {}, paging: {} } as TableMeta<R>),
      ),
  };
}
