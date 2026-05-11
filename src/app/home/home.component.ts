import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NewsRealTimeSearchService } from '../services/news-real-time-search.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ProductRealTimeServices } from '../services/product-realtime';
import { Observable } from 'rxjs';
import { ProductAdminFilterRequest, ProductAdminListing, ProductUserFilterRequest, ProductUserFilterRespone, ProductUserListing} from '../interface/interfaceResponeAPI';
import { NgOptimizedImage } from '@angular/common';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, NgOptimizedImage],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnChanges {
  products$!: Observable<ProductUserFilterRespone[]>;
  newsList: any[] = [];
  loading: boolean = false;
  filterRequest: ProductUserFilterRequest = {
    keyword: null,
    categoryId: null,
    nxbId: null,
    stock: 'all',
    minPrice: null,
    maxPrice: null,
    pagesize: 15,
    pageIndex: 1
  };
  products: ProductUserListing[] = [];
  categories = [
    { id: 1, name: 'Boardgame', icon: 'fa-solid fa-chess-knight' },
    { id: 2, name: 'Máy Tính Điện Tử', icon: 'fa-solid fa-calculator' },
    { id: 3, name: 'Giấy Photo', icon: 'fa-regular fa-file-lines' },
    { id: 4, name: 'Quả Địa Cầu', icon: 'fa-solid fa-earth-americas' },
    { id: 5, name: 'Lịch Sử Việt Nam', icon: 'fa-solid fa-landmark' },
    { id: 6, name: 'Văn Học', icon: 'fa-solid fa-book-open' },
    { id: 7, name: 'Tâm Lý Kỹ Năng', icon: 'fa-solid fa-brain' },
    { id: 8, name: 'Thiếu Nhi', icon: 'fa-solid fa-child-reaching' },
    { id: 9, name: 'Sách Học Ngoại Ngữ', icon: 'fa-solid fa-language' },
    { id: 10, name: 'Sách Tham Khảo', icon: 'fa-solid fa-graduation-cap' },
  ];
  constructor(
    private realTimeNewsService: NewsRealTimeSearchService,
    private router: Router,
    private dataService: ProductRealTimeServices,
  ) { }
  ngOnInit(): void {
    // this.realTimeNewsService.news$.subscribe(data => {
    //   this.newsList = data;
    // })
    // this.realTimeNewsService.loading$.subscribe(state => {
    //   this.loading = state;
    // })
    // this.products$ = this.dataService.product$; 
     this.dataService.productFilter$.subscribe(res => {
      this.products = res.products;
      console.log('Products:', this.products);
    });
    this.loadProducts();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('Previous:', changes['newsList'].previousValue);
    console.log('Current:', changes['newsList'].currentValue);
  }


  onCategoryClick(cat: any): void {
    this.router.navigate(['/products'], { queryParams: { category: cat.id } });
  }
  loadProducts() {
    this.dataService.filterProducts(this.filterRequest);
  }
}
