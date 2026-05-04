import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ProductRealTimeServices } from '../../../services/product-realtime';
import { MockDataService } from '../../../services/mockdata.service';

@Component({
  selector: 'app-manage-filter',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './manage-filter.component.html',
  styleUrl: './manage-filter.component.css'
})
export class ManageFilterComponent implements OnInit {
  keyword: string | null = null;
  category$!: Observable<any[]>;
  selectedCategoryId: number | null = null;
  selectedStatus: string | null = null;
  selectedPublisher: number | null = null;
  nxbList: any[] = [];
  @Output() search = new EventEmitter<string | null>();
  @Output() filterChange = new EventEmitter<any>();
  constructor(
    private dataService: ProductRealTimeServices,
    private mockData: MockDataService
  ) { }

  ngOnInit() {
    this.category$ = this.dataService.category$;
    this.dataService.loadCategories();
    this.category$.subscribe(data => {
      console.log('Categories:', data);
    });
    this.nxbList = this.mockData.lstNXB();
  }

  onSearch() {
    this.search.emit(this.keyword);
  }
  onFilterChange() {
    this.filterChange.emit({
      keyword: this.keyword,
      categoryId: this.selectedCategoryId,
      stock: this.selectedStatus,
      publisherId: this.selectedPublisher
    });
  }
}
