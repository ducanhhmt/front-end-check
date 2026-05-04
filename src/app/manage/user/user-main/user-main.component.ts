import { Component } from '@angular/core';
import { ManageHeaderComponent } from '../../shared/header/manage-header.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ManageFilterComponent } from '../../shared/manage-filter/manage-filter.component';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductAdminFilterRequest, ProductAdminListing } from '../../../interface/interfaceResponeAPI';
import { ApiServicesService } from '../../../services/api-services.service';
import { ProductRealTimeServices } from '../../../services/product-realtime';

@Component({
  selector: 'app-user-main',
  standalone: true,
  imports: [FormsModule, CommonModule, ManageFilterComponent, NzTabsModule, NzTableModule, NzPaginationModule, RouterModule, ManageHeaderComponent],
  templateUrl: './user-main.component.html',
  styleUrls: ['./user-main.component.css', '../../shared/manage-home/manage-home.component.css']
})
export class UserMainComponent {
    keyword: string = '';
  
    selectAllStatus = false;
    statusList = [
      { label: 'Đặt hàng', value: 'order', checked: false },
      { label: 'Đang giao dịch', value: 'processing', checked: false },
      { label: 'Đã hủy', value: 'cancelled', checked: false },
      { label: 'Hoàn thành', value: 'completed', checked: false },
      { label: 'Kết thúc', value: 'closed', checked: false }
    ];
  
    selectedDate: string | null = null;
    dateFrom: string = '';
    dateTo: string = '';
    category$!: Observable<any[]>;
    categories: any[] = [];
    products: ProductAdminListing[] = [];
  
    filterRequest: ProductAdminFilterRequest = {
      keyword: null,
      categoryId: null,
      nxbId: null,
      stock: 'all',
      pagesize: 10,
      pageIndex: 1
    };
  
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
      });
    }
  
    onFilterChange(data: any) {
      this.filterRequest = {
        ...this.filterRequest,
        keyword: data.keyword ?? null,
        categoryId: data.categoryId ?? null,
        nxbId: data.publisherId ?? null,
        stock: data.stock ?? 'all',
        pageIndex: 1
      };
      this.loadProducts();
    }
  
    toggleAllStatus() {
      this.statusList.forEach(item => item.checked = this.selectAllStatus);
    }
  
    setDate(type: string) {
      if (this.selectedDate === type) {
        this.selectedDate = null;  // click lần 2 → bỏ chọn
        this.dateFrom = '';
        this.dateTo = '';
      } else {
        this.selectedDate = type;
        if (type !== 'custom') {
          this.dateFrom = '';
          this.dateTo = '';
        }
      }
    }
  
    applyFilter() {
      const selectedStatus = this.statusList
        .filter(s => s.checked)
        .map(s => s.value);
  
      const filterData = {
        keyword: this.keyword,
        status: selectedStatus,
        date: this.selectedDate,
        dateFrom: this.dateFrom,
        dateTo: this.dateTo
      };
  
      console.log('Filter:', filterData);
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
