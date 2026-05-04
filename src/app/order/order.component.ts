import { Component, OnInit } from '@angular/core';
import { ApiServicesService } from '../services/api-services.service';
import { BillResponse, GetAllBillRequest } from '../interface/interfaceResponeAPI';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonModule } from '@angular/common';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { RouterModule } from '@angular/router';
import { PaginationUserComponent } from '../shared-view/pagination-user/pagination-user.component';
@Component({
  selector: 'app-order',
  standalone: true,
  imports: [
    NzTabsModule, NzListModule, NzCardModule,NzSpinModule,RouterModule,
    NzPaginationModule, NzButtonModule, NzTagModule, CommonModule,PaginationUserComponent
  ],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent implements OnInit {
  selectedTab = 0;
  selectedState: number | null = null;
  queryLoading: boolean = false;
  tabs = [
    { label: 'Tất cả', count: 0, state: null },
    { label: 'Chờ thanh toán', count: 0, state: -1 },  // chưa có state
    { label: 'Đang xử lý', count: 0, state: 0 },
    { label: 'Đang giao', count: 0, state: 1 },
    { label: 'Hoàn tất', count: 0, state: 2 },
    { label: 'Bị hủy', count: 0, state: 3 },
    { label: 'Đổi trả', count: 0, state: -1 },  // chưa có state
  ];

  pageIndex = 1;
  pageSize = 10;
  pageCount = 50;
  billData: BillResponse[] = [];

  constructor(
    private apiServices: ApiServicesService,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
    this.setUserBillStateSummary();
    this.getHistoryUserBillonState({userId:null, pageIndex:this.pageIndex, pagesize:this.pageSize, state: null})
  }

  selectTab(index: number): void {
    const tab = this.tabs[index];
    // Tab chưa xử lý → alert
    if (tab.state === -1) {
      this.message.info(`Tab "${tab.label}" chưa được hỗ trợ.`);
      return;
    }
    this.selectedTab = index;
    this.selectedState = tab.state; 
    this.pageIndex = 1;
    this.getHistoryUserBillonState({userId:null, pageIndex:this.pageIndex, pagesize:this.pageSize, state: this.selectedState})
  }

  onPageChange(page: number) {
    this.pageIndex = page;
    this.getHistoryUserBillonState({userId:null, pageIndex:this.pageIndex, pagesize:this.pageSize, state: this.selectedState})
  }

  setUserBillStateSummary() {
    this.apiServices.getAllUseBillStateSummary().subscribe({
      next: (data) => {
        this.tabs[0].count = data.all;
        this.tabs[2].count = data.processing;
        this.tabs[3].count = data.shipping;
        this.tabs[4].count = data.completed;
        this.tabs[5].count = data.cancelled;
      },
      error: () => {
        console.log("error fetch api");
      }
    });
  }

  getHistoryUserBillonState(data:GetAllBillRequest){
    this.queryLoading = true;
    this.apiServices.getAllUserOrders({ userId: null, pageIndex: data.pageIndex, pagesize: this.pageSize, state: data.state }).subscribe({
      next: (data) => {
        console.log("User orders:", data);
        this.billData = data.items;
        this.pageCount = data.pageCount;
        this.queryLoading = false;
      },
      error: () => {
        console.log("User orders:");
        this.queryLoading = false;
      }
    });
  }

  /*------- get Style -------*/
  getStatusLabel(state: number): string {
    switch (state) {
      case 0: return 'Đang xử lý';
      case 1: return 'Đang giao';
      case 2: return 'Hoàn tất';
      case 3: return 'Bị hủy';
      default: return 'Không xác định';
    }
  }

  getStatusColor(state: number): string {
    switch (state) {
      case 0: return 'blue';
      case 1: return 'orange';
      case 2: return 'green';
      case 3: return 'red';
      default: return 'default';
    }
  }

  getStatusStyle(state: number): { [key: string]: string } {
    switch (state) {
      case 0: return { background: '#e6f0fb', color: '#2489F4' };  // Đang xử lý — xanh dương
      case 1: return { background: '#fff3e0', color: '#f57c00' };  // Đang giao — cam
      case 2: return { background: '#e8f5e9', color: '#29a72a' };  // Hoàn tất — xanh lá
      case 3: return { background: '#ffe5e5', color: '#d70018' };  // Bị hủy — đỏ
      default: return { background: '#f5f5f5', color: '#888' };
    }
  }
}
