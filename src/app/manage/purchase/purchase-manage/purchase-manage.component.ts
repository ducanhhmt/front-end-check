import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductAdminPurchaseFilterRequest, ProductAdminPurchaseFilterRespone, PurchaseItemRequest, PurchaseOrderRequest, SupplierInfoResponse, SupplierViewResponse } from '../../../interface/interfaceResponeAPI';
import { ApiServicesService } from '../../../services/api-services.service';
import { NgOptimizedImage } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd/message';
import { v4 as uuidv4 } from "uuid";
// ===== SelectedProduct dùng interface thực từ API =====
interface SelectedProduct extends ProductAdminPurchaseFilterRespone {
  qty: number;
  discount: number;
}

@Component({
  selector: 'app-purchase-manage',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgOptimizedImage],
  templateUrl: './purchase-manage.component.html',
  styleUrls: ['./purchase-manage.component.css']
})
export class PurchaseManageComponent implements OnInit {
   isEditMode = false;
  purchaseId: string | null = null;
  userNameLogin: string | null = null;
  description: string = '';
  // ===== SUPPLIER =====
  supplierKeyword = '';
  supplierDropdownOpen = false;
  selectedSupplier: SupplierInfoResponse | null = null;
  listSupplier: SupplierViewResponse[] = [];

  filteredSuppliers: SupplierViewResponse[] = [...this.listSupplier];
  // ===== PRODUCT =====
  productKeyword = '';
  productDropdownOpen = false;
  isLoadingMore = false;
  hasMoreProducts = true;
  selectedProducts: SelectedProduct[] = [];
  filterRequest: ProductAdminPurchaseFilterRequest = {
    keyword: null,
    pageSize: 10,
    pageIndex: 1
  };
  ProductFiltered: ProductAdminPurchaseFilterRespone[] = [];

  constructor(
    private apiService: ApiServicesService,
    private message: NzMessageService,
    private router: Router,
    private route: ActivatedRoute  // inject ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getAllSuppliers();
    this.userNameLogin = this.getCookie('name');
    this.purchaseId = this.route.snapshot.paramMap.get('id');
    if (this.purchaseId) {
      this.isEditMode = true;
      this.loadPurchaseDetail(this.purchaseId);
    }
  }

  loadPurchaseDetail(id: string) {
    this.apiService.purchaseInfo(id).subscribe({
      next: (res) => {
        // Đổ supplier
        if (res.supplierId) {
          this.apiService.getSupplierInfo(res.supplierId).subscribe({
            next: (supplier) => {
              this.selectedSupplier = supplier;
            }
          });
        }

        // Đổ description, state
this.selectedProducts = res.purchaseItems.map(item => ({
  id: item.productId,
  name: item.productname,
  images: item.images,
  importPrice: item.importPrice,
  quantity: item.quantity,
  qty: item.quantity,
  discount: 0,
  // thêm các field bắt buộc còn thiếu từ ProductAdminPurchaseFilterRespone
} as unknown as SelectedProduct));
      },
      error: () => {
        this.message.error('Không thể tải thông tin đơn nhập hàng!');
      }
    });
  }

  getAllSuppliers() {
    this.apiService.getAllSuppliers().subscribe({
      next: (res) => {
        this.listSupplier = res;
        this.filteredSuppliers = [...this.listSupplier];
      },
      error: () => {
        this.message.error('Không thể tải danh sách nhà cung cấp!');
      }
    });
  }

  openSupplierDropdown() {
    this.supplierDropdownOpen = true;
  }

  onSupplierSearch() {
    const kw = this.supplierKeyword.toLowerCase();
    this.filteredSuppliers = this.listSupplier.filter(s =>
      s.name.toLowerCase().includes(kw)
    );
  }

  selectSupplier(supplier: SupplierViewResponse) {
    this.apiService.getSupplierInfo(supplier.id).subscribe({
      next: (res) => {
        this.selectedSupplier = res;
      },
      error: () => {
        this.message.error('Không thể tải thông tin nhà cung cấp!');
      }
    });
    this.supplierDropdownOpen = false;
    this.supplierKeyword = '';
  }

  removeSupplier() {
    this.selectedSupplier = null;
  }

  get totalQty(): number {
    return this.selectedProducts.reduce((s, p) => s + p.qty, 0);
  }

  get totalAmount(): number {
    return this.selectedProducts.reduce(
      (s, p) => s + p.qty * p.importPrice * (1 - p.discount / 100), 0
    );
  }

  openProductDropdown() {
    this.productDropdownOpen = true;
    // Reset khi mở lại dropdown
    this.ProductFiltered = [];
    this.filterRequest.pageIndex = 1;
    this.hasMoreProducts = true;
    this.loadProducts();
  }

  onProductSearch() {
    // Reset và tìm kiếm lại từ đầu
    this.ProductFiltered = [];
    this.filterRequest.pageIndex = 1;
    this.hasMoreProducts = true;
    this.filterRequest.keyword = this.productKeyword || null;
    this.loadProducts();
  }

  loadProducts() {
    if (this.isLoadingMore || !this.hasMoreProducts) return;  // 👈 guard
    this.isLoadingMore = true;
    this.apiService.getproductbyAdminPurchaseFilter(this.filterRequest).subscribe({
      next: (res: ProductAdminPurchaseFilterRespone[]) => {
        if (res.length < this.filterRequest.pageSize) {
          this.hasMoreProducts = false;  // 👈 không còn data
        }
        this.ProductFiltered = [...this.ProductFiltered, ...res];  // 👈 merge array
        this.isLoadingMore = false;
      },
      error: () => {
        this.isLoadingMore = false;
      }
    });
  }

  // 👇 Gọi khi scroll đến cuối dropdown
  onProductDropdownScroll(event: Event) {
    const el = event.target as HTMLElement;
    const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 50;  // threshold 50px
    if (nearBottom && !this.isLoadingMore && this.hasMoreProducts) {
      this.filterRequest.pageIndex!++;  // 👈 tăng page
      this.loadProducts();
    }
  }

  selectProduct(product: ProductAdminPurchaseFilterRespone) {
    const exists = this.selectedProducts.find(p => p.id === product.id);
    if (exists) {
      exists.qty++;
    } else {
      this.selectedProducts.push({ ...product, qty: 1, discount: 0 });
    }
    this.productDropdownOpen = false;
    this.productKeyword = '';
  }

  removeProduct(index: number) {
    this.selectedProducts.splice(index, 1);
  }

  /** Fallback khi ảnh lỗi: thay bằng ảnh mặc định */
  onImgError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/img/default.png';
  }

  submitOrder(state: number) {
    if (!this.selectedSupplier) {
      this.message.error('Vui lòng chọn nhà cung cấp!');
      return;
    }
    if (this.selectedProducts.length === 0) {
      this.message.error('Vui lòng chọn ít nhất một sản phẩm!');
      return;
    }
    const orderId = this.isEditMode ? this.purchaseId! : uuidv4();
    const lstPurchase: PurchaseItemRequest[] = this.selectedProducts.map(p => ({                                                      // server tạo
      purchaseId: orderId,                                                // server tạo
      productId: p.id,
      quantity: p.qty,
      importPrice: p.importPrice,
      totalPrice: p.qty * p.importPrice * (1 - p.discount / 100),
    }));

    const order: PurchaseOrderRequest = {
      id: orderId,
      userCreated: this.userNameLogin ?? "admin",
      supplierId: this.selectedSupplier.id,
      ImportPrice: this.totalAmount,
      purchaseItems: lstPurchase,
      description: this.description ?? "",
      dateCreated: new Date(),
      State: state
    };
    console.log('[PurchaseOrder]', order);
    this.apiService.createPurchaseOrder(order).subscribe({
      next: (res) => {
        if (res) {
          this.message.success('Đơn nhập kho đã được tạo thành công!');
          this.router.navigate(['/manage/purchase']);
        } else {
          this.message.error('Tạo đơn nhập kho thất bại!');
        }
      },
      error: (err) => {
        this.message.error('Có lỗi xảy ra khi tạo đơn nhập kho!', err);
      }
    });

    // TODO: gọi API → this.apiService.createPurchaseOrder(order).subscribe(...)
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.supplier-search-wrap')) {
      this.supplierDropdownOpen = false;
    }
    if (!target.closest('.product-search-wrap')) {
      this.productDropdownOpen = false;
    }
  }
  getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }
}