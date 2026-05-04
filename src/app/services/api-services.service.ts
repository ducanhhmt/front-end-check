import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BillResponse, BillStateSummary, CartItem, CartItemRequest, CategoryResponse, GetAllBillRequest, GetAllUserBillResponse, 
   LoginResponse, OrderPayload, ProductAdminFilterRespone,ProductAdminFilterRequest, ProductRespone, UploadResponse, UploadType, 
   UserRespone, ProductUserFilterRequest,ProductUserFilterRespone,ProductUserDetailRespone,
   updateUserProfileRequest,
   updatePasswordRequest,
   changeUserAddressRequest} from '../interface/interfaceResponeAPI';

@Injectable({
  providedIn: 'root'
})
export class ApiServicesService {
  constructor(
    private http: HttpClient
  ) { }
  private apiUrl = 'https://localhost:7051/api';
  //////======================Người dùng======================//////
  login(body: any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/User/Login`, body);
  }
  getUserInfo(): Observable<UserRespone> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.get<UserRespone>(`${this.apiUrl}/User/UserInfo`, { headers });
  }
  updateUserProfile(data: updateUserProfileRequest): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.put<any>(`${this.apiUrl}/User/updateUserProfile`, data, { headers })
  }
  updateUserPassword(data: updatePasswordRequest): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.put<any>(`${this.apiUrl}/User/updatePassword`, data, { headers })
  }
  updateUserAddress(data: changeUserAddressRequest): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.put<any>(`${this.apiUrl}/User/changeUserAddress`, data, { headers })
  }
  //////======================Sản phẩm======================//////
  getall(): Observable<ProductRespone[]> {
    return this.http.get<ProductRespone[]>(`${this.apiUrl}/Product`);
  }
  AdminGetproductbyid(id: string): Observable<ProductUserDetailRespone> {
    return this.http.get<ProductUserDetailRespone>(`${this.apiUrl}/Product/admin-search/${id}`);
  }

  userGetproductbyid(id: string): Observable<ProductUserDetailRespone> {
    return this.http.get<ProductUserDetailRespone>(`${this.apiUrl}/Product/user-search/${id}`);
  }

  getproductbyAdminFilter(data: ProductAdminFilterRequest): Observable<ProductAdminFilterRespone> {
    return this.http.post<ProductAdminFilterRespone>(`${this.apiUrl}/Product/AdminFilter`, data);
  }
   getproductbyUserFilter(data: ProductUserFilterRequest): Observable<ProductUserFilterRespone> {
    return this.http.post<ProductUserFilterRespone>(`${this.apiUrl}/Product/UserFilter`, data);
  }
  addProduct(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Product`, data);
  }
  updateProduct(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/Product`, data);
  }
  //////Danh mục//////
  menuCategories(): Observable<CategoryResponse[]> {
    return this.http.get<CategoryResponse[]>(`${this.apiUrl}/Category/Menu`);
  }
  getallCategories(): Observable<CategoryResponse[]> {
    return this.http.get<CategoryResponse[]>(`${this.apiUrl}/Category`);
  }
  //////======================Giỏ hàng======================//////
  getUserCart(): Observable<CartItem[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.get<CartItem[]>(`${this.apiUrl}/Cart/Cart`, { headers });
  }
  addProductToCart(data: CartItemRequest): Observable<CartItem> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.post<CartItem>(`${this.apiUrl}/Cart`, data, { headers });
  }
  ///////======================Hóa đơn========================//////
  getAllUseBillStateSummary(): Observable<BillStateSummary> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.get<BillStateSummary>(`${this.apiUrl}/Order/UserBillStateSummary`, { headers });
  };
  

  getAllUserOrders(data: GetAllBillRequest): Observable<GetAllUserBillResponse> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.post<GetAllUserBillResponse>(`${this.apiUrl}/Order/GetAllUserBillInfo`, data, { headers });
  };

  getBillInfo(billId: string): Observable<BillResponse> {
    return this.http.get<BillResponse>(`${this.apiUrl}/Order/GetBillInfo?billId=${billId}`)
  };

  createBill(data: OrderPayload): Observable<BillResponse> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.post<BillResponse>(`${this.apiUrl}/Order/CreateBill`, data, { headers });
  }
  ///////======================Upload======================//////
  uploadImage(files: File[], category: UploadType): Observable<UploadResponse> {
    const formData = new FormData();
    // append nhiều file
    files.forEach(file => {
      formData.append('Files', file);
    });
    formData.append('Category', category.toString());
    return this.http.post<UploadResponse>(
      `${this.apiUrl}/Upload/Upload`,
      formData
    );
  }
  //////////////======================NEWS REAL TIME SEARCH======================//////////////
  searching(keyword: string, requestId: string): Promise<any> {
    return this.http.get(`${this.apiUrl}/News/Search?keyword=${keyword}&requestId=${requestId}`).toPromise();
  }


  ///======================Get Token======================///
  private getToken(): string {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1] ?? '';
  }
}
