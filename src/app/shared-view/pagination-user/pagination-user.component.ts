import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination-user.component.html',
  styleUrl: './pagination-user.component.css'
})
export class PaginationUserComponent implements OnChanges{
  @Input() pageCount: number = 0;
  @Input() currentPage: number = 1;
  @Output() pageChange = new EventEmitter<number>();

  pages: number[] = [];
  readonly MAX_VISIBLE = 6;

  ngOnChanges(): void {
    this.buildPages();
  }

  buildPages(): void {
    const total = this.pageCount;
    const current = this.currentPage;
    //console.log('Xây dựng trang: total=', total, 'current=', current);
    if (total <= this.MAX_VISIBLE) {
      this.pages = Array.from({ length: total }, (_, i) => i + 1);
      return;
    }

    // Luôn hiển thị tối đa 6 trang, căn giữa xung quanh trang hiện tại
    let start = Math.max(1, current - 2);
    let end = start + this.MAX_VISIBLE - 1;

    if (end > total) {
      end = total;
      start = Math.max(1, end - this.MAX_VISIBLE + 1);
    }

    this.pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  onPageClick(page: number): void {
    if (page === this.currentPage) return;
    this.pageChange.emit(page);
  }

  onPrev(): void {
    if (this.currentPage > 1) this.pageChange.emit(this.currentPage - 1);
  }

  onNext(): void {
    if (this.currentPage < this.pageCount) this.pageChange.emit(this.currentPage + 1);
  }
}
