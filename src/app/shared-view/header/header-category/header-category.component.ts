import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header-category',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header-category.component.html',
  styleUrl: './header-category.component.css'
})
export class HeaderCategoryComponent implements OnInit, OnChanges {
  selectedCategory: any = null;

  @Input() categories: any[] = [];

  constructor() { }

  ngOnInit(): void {
    this.setCategory();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['categories'] && this.categories?.length) {
      this.setCategory();
    }
  }
  /// chỉ set nếu category có dữ liệu ///
  private setCategory(): void {
    if (!this.selectedCategory && this.categories?.length) {
      this.selectedCategory = this.categories[0];
    }
  }
}
