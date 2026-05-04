import { Component, OnInit } from '@angular/core';
import { signalRService } from '../services/signalR.service';
import { ApiServicesService } from '../services/api-services.service';
import { ProductUserFilterRequest, ProductUserFilterRespone } from '../interface/interfaceResponeAPI';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { FormsModule } from '@angular/forms';
import { PaginationUserComponent } from '../shared-view/pagination-user/pagination-user.component';
@Component({
  selector: 'app-product-searching',
  standalone: true,
  imports: [CommonModule, RouterModule, NgOptimizedImage, NzSpinModule, FormsModule, PaginationUserComponent],
  templateUrl: './product-searching.component.html',
  styleUrl: './product-searching.component.css'
})
export class ProductSearchingComponent implements OnInit {
  keySearching: string | null = null;
  selectedStatus: string = 'instock';
  loading = true;
  productDataFilter: ProductUserFilterRespone = {
    products: [],
    pageCount: 0,
    totalRecords: 0
  };
  filterRequest: ProductUserFilterRequest = {
    keyword: null,
    categoryId: null,
    nxbId: null,
    stock: 'instock',
    minPrice: null,
    maxPrice: null,
    pagesize: 12,
    pageIndex: 1
  }
  constructor(
    private route: ActivatedRoute,
    private signalRService: signalRService,
    private apiService: ApiServicesService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const keyword = params['keysearch'];
      if (keyword) {
        this.filterRequest.keyword = keyword;
        this.keySearching = keyword;
      }
      //console.log('Keyword từ URL:', keyword);
      this.loadProducts();
    });
  }

  onStatusChange(status: string): void {
    this.filterRequest.stock = status;
    this.filterRequest.pageIndex = 1; // Reset về trang đầu khi thay đổi trạng thái
    this.loadProducts();
  }

  onCategoryChange(categoryId: number, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.filterRequest.categoryId = checked ? categoryId : null;
    this.loadProducts();
  }

  onPageChange(page: number): void {
    this.filterRequest.pageIndex = page;
    this.loadProducts();
  }

  onPriceRangeChange(min: number, max: number | null): void {
    this.filterRequest.minPrice = min;
    this.filterRequest.maxPrice = max;
    this.loadProducts();
  }

  onManualPriceChange(): void {
    this.loadProducts();
  }

  onSliderChange(event: Event): void {
    const value = +(event.target as HTMLInputElement).value;
    this.filterRequest.maxPrice = value;
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.apiService.getproductbyUserFilter(this.filterRequest).subscribe({
      next: (data: ProductUserFilterRespone) => {
        this.productDataFilter.products = data.products;
        this.productDataFilter.pageCount = data.pageCount;
        this.productDataFilter.totalRecords = data.totalRecords;
        this.loading = false;
        //console.log('Kết quả tìm kiếm:', this.productDataFilter);
      },
      error: (err) => {
        console.error('Lỗi khi lấy dữ liệu sản phẩm:', err);
        this.loading = false;
      }
    });
  }
}