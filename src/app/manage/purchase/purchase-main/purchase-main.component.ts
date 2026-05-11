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
import { ProductAdminListing, ProductAdminPurchaseFilterRequest, PurchaseViewResponse } from '../../../interface/interfaceResponeAPI';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-purchase-main',
  standalone: true,
  imports: [FormsModule, CommonModule, ManageFilterComponent, NzTabsModule, NzTableModule, NzPaginationModule, RouterModule, ManageHeaderComponent],
  templateUrl: './purchase-main.component.html',
  styleUrls: ['./purchase-main.component.css', '../../shared/manage-home/manage-home.component.css']
})
export class PurchaseMainComponent implements OnInit {
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
  datas: PurchaseViewResponse[] = [];

  filterRequest: ProductAdminPurchaseFilterRequest = {
    keyword: null,
    pageSize: 10,
    pageIndex: 1
  };

  totalPages = 0;
  totalRecords = 0;

  constructor(
    private apiService: ApiServicesService,
    private dataService: ProductRealTimeServices
  ) { }

  ngOnInit(): void {
    this.loadPurchase();
    this.category$ = this.dataService.category$;
    this.dataService.loadCategories();
    this.category$.subscribe(data => {
      this.categories = data;
    });
  }

  loadPurchase() {
    this.apiService.purchasePaginationFilter(this.filterRequest).subscribe(res => {
      this.datas = res.data;
      this.totalPages = res.pageCount;
      this.totalRecords = res.totalRecords;
    });
    console.log("purchase:", this.datas);
  }

  onFilterChange(data: any) {
    this.filterRequest = {
      ...this.filterRequest,
      keyword: data.keyword ?? null,
      pageIndex: 1
    };
    this.loadPurchase();
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
    this.loadPurchase();
  }

  onPageSizeChange(size: number): void {
    this.filterRequest.pageSize = size;
    this.filterRequest.pageIndex = 1;
    this.loadPurchase();
  }

  getStatusLabel(state: number): string {
    const statusMap = {
      0: 'Đang giao dịch',
      1: 'Hoàn thành',
      2: 'Đã hủy'
    };
    return statusMap[state as keyof typeof statusMap] || 'Không xác định';
  }
}