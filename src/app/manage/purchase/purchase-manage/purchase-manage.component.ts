import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface Supplier {
  id: number;
  name: string;
  code: string;
  phone: string;
  email: string;
  address: string;
  company: string;
  debt: number;
  totalOrders: number;
  totalAmount: number;
}

interface Product {
  id: number;
  name: string;
  sku: string;
  importPrice: number;
  stock: number;
  available: number;
}

interface SelectedProduct extends Product {
  qty: number;
  discount: number;
}

@Component({
  selector: 'app-purchase-manage',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './purchase-manage.component.html',
  styleUrls: ['./purchase-manage.component.css']
})
export class PurchaseManageComponent {

  tachDong = false;

  // ===== SUPPLIER =====
  supplierKeyword = '';
  supplierDropdownOpen = false;
  selectedSupplier: Supplier | null = null;

  allSuppliers: Supplier[] = [
    {
      id: 1,
      name: 'Công ty TNHH NXB Kim Đồng',
      code: 'NCC0001',
      phone: '024 3942 4866',
      email: 'kimdong@nxbkimdong.com.vn',
      address: '55 Quang Trung, Hai Bà Trưng, Hà Nội',
      company: 'NXB Kim Đồng',
      debt: 12500000,
      totalOrders: 34,
      totalAmount: 485000000
    },
    {
      id: 2,
      name: 'Công ty CP Phát hành Sách TP.HCM',
      code: 'NCC0002',
      phone: '028 3822 4029',
      email: 'fahasa@fahasa.com',
      address: '60-62 Lê Lợi, Bến Nghé, Quận 1, TP.HCM',
      company: 'FAHASA',
      debt: 0,
      totalOrders: 21,
      totalAmount: 320000000
    },
    {
      id: 3,
      name: 'Nhà xuất bản Trẻ',
      code: 'NCC0003',
      phone: '028 3931 6289',
      email: 'nxbtre@nxbtre.com.vn',
      address: '161B Lý Chính Thắng, Phường 7, Quận 3, TP.HCM',
      company: 'NXB Trẻ',
      debt: 4200000,
      totalOrders: 18,
      totalAmount: 215000000
    },
    {
      id: 4,
      name: 'Công ty TNHH Đông A',
      code: 'NCC0004',
      phone: '024 3574 1983',
      email: 'contact@dongabook.com.vn',
      address: '10 Trần Nhật Duật, Hai Bà Trưng, Hà Nội',
      company: 'Đông A Books',
      debt: 8750000,
      totalOrders: 12,
      totalAmount: 98000000
    },
    {
      id: 5,
      name: 'Nhà xuất bản Thế Giới',
      code: 'NCC0005',
      phone: '024 3825 2063',
      email: 'nxbthegioi@thegioi.vn',
      address: '46 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội',
      company: 'NXB Thế Giới',
      debt: 0,
      totalOrders: 9,
      totalAmount: 67500000
    }
  ];

  filteredSuppliers: Supplier[] = [...this.allSuppliers];

  openSupplierDropdown() {
    this.supplierDropdownOpen = true;
    this.filteredSuppliers = [...this.allSuppliers];
  }

  onSupplierSearch() {
    const kw = this.supplierKeyword.toLowerCase();
    this.filteredSuppliers = this.allSuppliers.filter(s =>
      s.name.toLowerCase().includes(kw) ||
      s.code.toLowerCase().includes(kw) ||
      s.phone.includes(kw)
    );
  }

  selectSupplier(supplier: Supplier) {
    this.selectedSupplier = supplier;
    this.supplierDropdownOpen = false;
    this.supplierKeyword = '';
  }

  removeSupplier() {
    this.selectedSupplier = null;
  }

  // ===== PRODUCT =====
  productKeyword = '';
  productDropdownOpen = false;

  allProducts: Product[] = [
    { id: 1, name: 'Friezen Pháp Sư Tiền Tăng - Tập 13 - Bản Đặc Biệt', sku: 'PVN2571', importPrice: 44000, stock: 1, available: 0 },
    { id: 2, name: 'Dấu Ấn Hoàng Gia - Tập 52', sku: 'PVN2570', importPrice: 24000, stock: 2, available: 0 },
    { id: 3, name: 'Dấu Ấn Hoàng Gia - Tập 51', sku: 'PVN2569', importPrice: 24000, stock: 2, available: 0 },
    { id: 4, name: 'Hoa Thơm Kiêu Hãnh - Tập 17', sku: 'PVN2568', importPrice: 44000, stock: 5, available: 5 },
    { id: 5, name: 'Nữ Binh Thần Tốc - Tập 13', sku: 'PVN2567', importPrice: 36000, stock: 1, available: 0 },
    { id: 6, name: 'Host Club Trường Ouran - Tập 3', sku: 'PVN2566', importPrice: 28000, stock: 3, available: 2 },
    { id: 7, name: 'Thám Tử Lừng Danh Conan - Tập 100', sku: 'PVN2565', importPrice: 32000, stock: 10, available: 8 },
    { id: 8, name: 'One Piece - Tập 105', sku: 'PVN2564', importPrice: 30000, stock: 7, available: 6 },
  ];

  filteredProducts: Product[] = [...this.allProducts];
  selectedProducts: SelectedProduct[] = [];

  get totalQty(): number {
    return this.selectedProducts.reduce((s, p) => s + p.qty, 0);
  }

  get totalAmount(): number {
    return this.selectedProducts.reduce((s, p) => s + (p.qty * p.importPrice - p.discount), 0);
  }

  openProductDropdown() {
    this.productDropdownOpen = true;
    this.filteredProducts = [...this.allProducts];
  }

  onProductSearch() {
    const kw = this.productKeyword.toLowerCase();
    this.filteredProducts = this.allProducts.filter(p =>
      p.name.toLowerCase().includes(kw) || p.sku.toLowerCase().includes(kw)
    );
  }

  selectProduct(product: Product) {
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
}