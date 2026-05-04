import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiServicesService } from './api-services.service';
import { ProductAdminFilterRespone, ProductAdminFilterRequest, ProductRespone, UserRespone, ProductUserFilterRequest, ProductUserFilterRespone } from '../interface/interfaceResponeAPI';

@Injectable({
  providedIn: 'root'
})
export class ProductRealTimeServices {

  constructor(
    private apiService: ApiServicesService
  ) { }

  private userLoginSubject = new BehaviorSubject<UserRespone>({
    id: '',
    firstName: '',
    lastName:'',
    name: '',
    email: '',
    phone: '',
    lstAddress: null,
    gender: false,
    birthday: new Date()
    // avatar: ''
  });
  private categorySubject = new BehaviorSubject<any[]>([]);
  private productFilterSubject = new BehaviorSubject<ProductUserFilterRespone>({ products: [], pageCount: 0, totalRecords: 0 });
  category$ = this.categorySubject.asObservable();
  productFilter$ = this.productFilterSubject.asObservable();
  userLogin$ = this.userLoginSubject.asObservable();

  ////////-------Product Filter-------////////
  filterProducts(request: ProductUserFilterRequest) {
    this.apiService.getproductbyUserFilter(request)
      .subscribe(data =>
        this.productFilterSubject.next(data)
      );
  }

  ////////-------CATEGORY-------////////
  loadCategories() {
    const current = this.categorySubject.value;
    if (current && current.length > 0) return;
    this.apiService.getallCategories().subscribe({
      next: (response) => {
        this.categorySubject.next(response);
        console.log('Categories loaded:', response);
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      }
    });
  }

  ////////-------User-------////////
  loadUserInfo() {
    const current = this.userLoginSubject.value;
    if (current && current.id) return; // Already loaded
    this.apiService.getUserInfo().subscribe({
      next: (response) => {
        this.userLoginSubject.next(response);
      },
      error: (error) => {
        console.error('Error fetching user info:', error);
      }
    });
  }
}