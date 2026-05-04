import { Component, OnInit } from '@angular/core';
import { CartItem, OrderPayload, UserRespone } from '../interface/interfaceResponeAPI';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiServicesService } from '../services/api-services.service';
import { ProductRealTimeServices } from '../services/product-realtime';
import { Observable } from 'rxjs';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  addresses = [
    { id: 1, name: '', phone: '', adress: '', isDefault: true }
  ];
  isApplyPromo: boolean = false;
  promoDiscount: number = 10000;
  promoMinCondition: number = 150000;
  selectedAddressId = 1;
  userLogin$!: Observable<UserRespone>;
  cartItems: CartItem[] = [];
  newAddress = { name: '', phone: '', adress: '' };
  isCreatedAnotherAdress: boolean = false;
  shippingFee: number = 22000;
  constructor(
    private router: Router,
    private apiServices: ApiServicesService,
    private dataService: ProductRealTimeServices
  ) { }
  ngOnInit(): void {
    this.apiServices.getUserCart().subscribe({
      next: (data: CartItem[]) => {
        console.log("User cart:", data);
        this.cartItems = data.map(item => ({
        ...item,
        cartQuantity: item.lowStock ? 1 : item.cartQuantity  // ✅ ép về 1 nếu lowStock
    }));
      },
      error: () => {
        console.log("User cart:");
      }
    });
    this.userLogin$ = this.dataService.userLogin$;
    this.userLogin$.subscribe(user => {
      console.log('User info:', user);
      this.addresses[0] = { ...this.addresses[0], name: user.name, phone: user.phone, adress: user.lstAddress?.[0] || '' };
    });
  }

  // ================== HANDLE ==================
  toggleSelectAll(event: any) {
    const checked = event.target.checked;
    this.cartItems.forEach(x => x.selected = checked);
  }

  isAllSelected(): boolean {
    return this.cartItems.every(x => x.selected);
  }

  increase(item: CartItem) {
    if (item.soldOut) return;
    if (item.lowStock) return;  // ✅ lowStock thì không tăng được
    if (item.cartQuantity >= item.stockQuantity) return;
  }

  decrease(item: CartItem) {
    if (item.cartQuantity > 1) item.cartQuantity--;
  }

  removeItem(id: number) {
    this.cartItems = this.cartItems.filter(x => x.id !== id);
  }

  // ================== CALC ==================
  get subTotal(): number {
    return this.cartItems
      .filter(x => x.selected)
      .reduce((sum, item) => sum + item.price * item.cartQuantity, 0);
  }

  get total(): number {
    if (this.subTotal === 0) return 0;
    let total = this.subTotal + this.shippingFee;
    if (this.isApplyPromo && this.isEligibleForPromo) {
      total -= this.promoDiscount;
    }

    return total;
  }

  // ================== CHECKOUT ==================
  checkout() {
    const selectedItems = this.cartItems.filter(x => x.selected);
    if (selectedItems.length === 0) {
      alert('Vui lòng chọn ít nhất một sản phẩm để thanh toán.');
      return;
    }
    const selectedAddress = this.selectedAddress();
    if (!selectedAddress) {
      alert('Vui lòng chọn địa chỉ giao hàng.');
      return;
    }
    const orderPayload: OrderPayload = {
      userId: null, // lấy từ service / localStorage / auth
      userName: selectedAddress.name,
      address: selectedAddress.adress,
      phone: selectedAddress.phone,
      shippingPrice: this.shippingFee,
      totalPrice: this.total,
      discountPrice: this.isApplyPromo && this.isEligibleForPromo ? this.promoDiscount : 0, // TODO: tính toán giảm giá
      items: selectedItems.map(item => ({
        productId: item.productId,  // field UUID từ CartItem
        quantity: item.cartQuantity
      }))
    };
    console.log('Order payload:', orderPayload);
    // Gọi API đặt hàng
    this.apiServices.createBill(orderPayload).subscribe({
      next: (res) => {
        console.log('Đặt hàng thành công:', res);
        const id = res?.id; // ⚠️ tùy theo response backend
        if (id) {
          this.router.navigate(['/order', id]);
        } else {
          console.error('Không tìm thấy id trong response');
        }
      },
      error: (err) => {
        console.error('Đặt hàng thất bại:', err);
      }
    });
  }

  creatednewAddress() {
    if (!this.newAddress.name || !this.newAddress.phone || !this.newAddress.adress) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }
    const newAddress = {
      id: this.addresses.length + 1,
      name: this.newAddress.name,
      phone: this.newAddress.phone,
      adress: this.newAddress.adress,
      isDefault: false
    };
    this.addresses = [...this.addresses, newAddress];
    this.selectedAddressId = newAddress.id; // auto tick địa chỉ mới
    this.isCreatedAnotherAdress = true;
    this.newAddress = { name: '', phone: '', adress: '' };
    // 👉 Đóng modal
    const modalEl = document.getElementById('addressModal');
    if (modalEl) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalEl)
        || new (window as any).bootstrap.Modal(modalEl);
      modal.hide();
    }
  }

  selectAddress(id: number) {
    this.selectedAddressId = id;
  }

  deleteNewAddress(id: number) {
    this.addresses = this.addresses.filter(x => x.id !== id);
    this.selectedAddressId = 1;
    this.isCreatedAnotherAdress = false;
  }

  selectedAddress() {
    return this.addresses.find(a => a.id === this.selectedAddressId);
  }

  /// ================== Add mã giảm giá ( nếu đủ điều kiện ) ================== //
  get isEligibleForPromo(): boolean {
    return this.subTotal > this.promoMinCondition;
  }
  onTogglePromo(event: any) {
    if (!this.isEligibleForPromo) {
      this.isApplyPromo = false;
      return;
    }
    this.isApplyPromo = event.target.checked;
  }
}
