import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-table-paginator',
  templateUrl: './table-paginator.component.html',
  styleUrls: ['./table-paginator.component.scss'],
})
export class TablePaginatorComponent implements AfterViewInit {
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @Input()
  prefix = 'Items';

  @Input()
  length = 0;

  @Input()
  pageCount = 0;

  @Input()
  pageIndex = 1;

  @Input()
  pageSizeOptions = [10, 25, 50];

  pageSize = this.pageSizeOptions[0];

  get totalPages() {
    if (!this.length || !this.pageSize) {
      return 1;
    }
    return Math.max(Math.ceil(this.length / this.pageSize), 1);
  }

  get pageOptions() {
    return new Array(this.totalPages).fill(null).map((_, i) => i + 1);
  }

  ngAfterViewInit(): void {
    this.paginator._intl.itemsPerPageLabel = 'Show';
    this.paginator._intl.getRangeLabel = this.getRangeLabel;
    this.paginator.page.subscribe((ev: PageEvent) => (this.pageSize = ev.pageSize));
  }

  goTo(pageIndex: number): void {
    this.paginator.pageIndex = pageIndex;
    this.paginator.page.next({
      pageIndex: pageIndex - 1,
      pageSize: this.pageSize,
      length: this.length,
    });
  }

  private getRangeLabel = (pageIndex: number, pageSize: number, length: number): string => {
    if (length === 0 || pageSize === 0) {
      return `0 of ${length} ${this.prefix}`;
    }

    length = Math.max(length, 0);

    const startIndex: number = pageIndex * pageSize;
    const endIndex: number =
      startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;

    return `${startIndex + 1}-${endIndex} of ${length} ${this.prefix}`;
  };
}
