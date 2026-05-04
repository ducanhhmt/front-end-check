import { Component, OnInit } from '@angular/core';
import { CartItemRequest, ImageItem, ProductUserDetailRespone } from '../interface/interfaceResponeAPI';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiServicesService } from '../services/api-services.service';
import { MockDataService } from '../services/mockdata.service';
import { CommonModule } from '@angular/common';
import { ImagePreviewComponent } from '../manage/shared/image-preview/image-preview.component';
import { FormsModule } from '@angular/forms';
import { NzMessageService  } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';
@Component({
  selector: 'app-product-info',
  standalone: true,
  imports: [CommonModule, ImagePreviewComponent,RouterModule, FormsModule, NzSpinModule],
  templateUrl: './product-info.component.html',
  styleUrl: './product-info.component.css'
})
export class ProductInfoComponent implements OnInit {
  product: ProductUserDetailRespone | null = null;
  quantity = 1;
  images: ImageItem[] = [];
  previewTrigger: { index: number } | null = null;
  constructor(
    private route: ActivatedRoute,
    private services: ApiServicesService,
    private mockData: MockDataService,
    private message: NzMessageService 
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      console.error('No product ID found in route');
      return;
    }
    console.log('Product ID from route:', id);
    this.getProductDetails(id);
  }
  getProductDetails(id: string) {
    this.services.userGetproductbyid(id).subscribe({
      next: (data: ProductUserDetailRespone) => {
        this.product = data;
        this.images = data.images.map((url: string) => ({
          file: null as any,
          preview: url,
          url: url
        }));
        console.log('Product details:', this.product);
      },
      error: (err) => {
        console.error('Error fetching product details:', err);
      }
    });
  }

  openPreview(index: number) {
    this.previewTrigger = { index }; // object mới mỗi lần → luôn trigger ngOnChanges
  }
  increase() {
    this.quantity++;
  }

  decrease() {
    if (this.quantity > 1) this.quantity--;
  }
  addProducttocart() {
    const cartItem: CartItemRequest = {
      productId: this.product?.id?.toString() ?? null,
      userId:null,
      quantity: this.quantity
    };
    this.services.addProductToCart(cartItem).subscribe({
      next: (data) => {
         this.message.success('Thêm sản phẩm vào giỏ hàng thành công!');
      },
      error: (err) => {
        this.message.error('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng!');
      }
    });

  }
  getNameNxb(id: number): string {
    return this.mockData.getNxbNameById(id);
  }
}
