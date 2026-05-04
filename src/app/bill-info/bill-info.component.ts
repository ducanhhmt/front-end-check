import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ApiServicesService } from '../services/api-services.service';
import { BillResponse } from '../interface/interfaceResponeAPI';

@Component({
  selector: 'app-bill-info',
  standalone: true,
  imports: [CommonModule,
    NzCardModule, NzStepsModule, NzTagModule,
    NzAlertModule, NzTableModule, NzButtonModule,
    NzGridModule, NzDividerModule, NzIconModule],
  templateUrl: './bill-info.component.html',
  styleUrl: './bill-info.component.css'
})
export class BillInfoComponent {
  order: any = {};

  constructor(
    private route: ActivatedRoute,
    private apiServices: ApiServicesService  // bỏ comment khi có API
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log("id là:", id);
    if (!id) {
      console.error('Bill ID is required');
      return;
    }
    this.apiServices.getBillInfo(id).subscribe({
      next: (data: BillResponse) => {
        console.log("billInfo:", data);
        this.mapOrder(data);
      },
      error: () => {
        console.log("Error load BillInfo:");
      }
    })
  }

  mapOrder(data: any): void {
    this.order = {
      code: data.id.split('-')[0].toUpperCase(),  // lấy phần đầu id làm mã hiển thị
      status: this.getStatusLabel(data.state),
      state: data.state,
      createdAt: new Date(data.dateCreated).toLocaleDateString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      }),
      currentStep: this.getStepByState(data.state),
      steps: data.state === 3
        ? [
          { label: 'Đang xử lý', time: '', icon: 'file-text' },
          { label: 'Đang vận chuyển', time: '', icon: 'car' },
          { label: 'Đã hủy', time: '', icon: 'close-circle' }
        ]
        : [
          { label: 'Đang xử lý', time: '', icon: 'file-text' },
          { label: 'Đang vận chuyển', time: '', icon: 'car' },
          { label: 'Hoàn tất', time: '', icon: 'check-circle' }
        ],
      recipient: {
        name: data.userName ?? '',
        phone: data.phone,
        address: data.address
      },
      paymentMethod: data.paymentMethod ?? 'Ví ZaloPay',
      subTotal: data.totalPrice + data.shippingPrice - (data.discountPrice ?? 0),
      shippingFee: data.shippingPrice,
      discount: data.discountPrice ?? 0,
      total: data.totalPrice,
      packages: [
        {
          code: data.id.substring(0, 13).toUpperCase(),
          status: this.getStatusLabel(data.state),
          total: data.totalPrice,
          items: data.items.map((item: any) => ({
            name: item.name,
            sku: item.productId.split('-')[0],
            image: item.thumbnail,
            price: item.price,
            originalPrice: item.importPrice,
            quantity: item.quantity,
            note: ''
          }))
        }
      ]
    };
  }
  getStatusLabel(state: number): string {
    switch (state) {
      case 0: return 'Đang xử lý';
      case 1: return 'Đang vận chuyển';
      case 2: return 'Hoàn tất';
      case 3: return 'Đã hủy';
      default: return 'Không xác định';
    }
  }

  getStepByState(state: number): number {
    switch (state) {
      case 0: return 0;  // Đang xử lý   → active step 0
      case 1: return 1;  // Đang giao     → active step 1
      case 2: return 2;  // Hoàn tất      → active step 2 (full)
      case 3: return 2;  // Đã hủy        → active step 2 (icon close-circle)
      default: return 0;
    }
  }

  get headerBgColor(): string {
    switch (this.order.state) {
      case 0: return 'rgba(201, 240, 255, 0.5)';
      case 1: return 'rgba(201, 240, 255, 0.5)';
      case 2: return 'rgba(227, 250, 218, 0.5)';
      case 3: return 'rgba(255, 202, 202, 0.5)';
      default: return '#2F80ED';
    }
  }

  get headerTextColor(): string {
    return this.order.state === 3 ? '#c0392b' : '#ffffff';
  }

  get stepperClass(): string {
    switch (this.order.state) {
      case 0:
      case 1: return 'stepper-processing';
      case 2: return 'stepper-success';
      case 3: return 'stepper-cancelled';
      default: return 'stepper-processing';
    }
  }

  cancelOrder() {
    console.log('Hủy đơn:', this.order.code);
    // TODO: gọi API hủy đơn
  }

  reorder() {
    console.log('Mua lại:', this.order.code);
    // TODO: thêm lại sản phẩm vào giỏ hàng
  }
}