import { Component, OnInit } from '@angular/core';
import { ManageFilterComponent } from '../../shared/manage-filter/manage-filter.component';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTableModule } from 'ng-zorro-antd/table';
import { RouterModule } from '@angular/router';
import { ManageHeaderComponent } from '../../shared/header/manage-header.component';
import { ApiServicesService } from '../../../services/api-services.service';
import { ProductRealTimeServices } from '../../../services/product-realtime';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ProductAdminFilterRequest, ProductAdminListing} from '../../../interface/interfaceResponeAPI';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
@Component({
  selector: 'app-product-main',
  standalone: true,
  imports: [CommonModule, ManageFilterComponent, NzTabsModule, NzTableModule, NzPaginationModule, RouterModule, ManageHeaderComponent],
  templateUrl: './product-main.component.html',
  styleUrls: ['./product-main.component.css', '../../shared/manage-home/manage-home.component.css']
})
export class ProductMainComponent implements OnInit {
  // products$!: Observable<any[]>;
  category$!: Observable<any[]>;
  categories: any[] = [];
  products: ProductAdminListing[] = [];
  // filter state
  filterRequest: ProductAdminFilterRequest = {
    keyword: null,
    categoryId: null,
    nxbId: null,
    stock: 'all',
    pagesize: 10,
    pageIndex: 1
  };
  // pagination
  totalPages = 0;
  totalRecords = 0;
  constructor(
    private apiService: ApiServicesService,
    private dataService: ProductRealTimeServices
  ) { }

  ngOnInit(): void {
    this.loadProducts();
    this.category$ = this.dataService.category$;
    this.dataService.loadCategories();
    this.category$.subscribe(data => {
      this.categories = data;
    });
  }
  loadProducts() {
    this.apiService.getproductbyAdminFilter(this.filterRequest).subscribe(res => {
      this.products = res.products;
      this.totalPages = res.pageCount;
      this.totalRecords = res.totalRecords;
      console.log('Products:', this.products);
    });
  }
  onFilterChange(data: any) {
    console.log('Filter changed:', data);
    this.filterRequest = {
      ...this.filterRequest,
      keyword: data.keyword ?? null,
      categoryId: data.categoryId ?? null,
      nxbId: data.publisherId ?? null,
      stock: data.stock ?? "all",
      pageIndex: 1 // reset về trang 1 khi filter thay đổi
    };
    this.loadProducts();
  }
  onPageIndexChange(index: number): void {
    this.filterRequest.pageIndex = index;
    this.loadProducts();
  }
  onPageSizeChange(size: number): void {
    this.filterRequest.pagesize = size;
    this.filterRequest.pageIndex = 1;
    this.loadProducts();
  }
}
