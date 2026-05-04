import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user.component';
import { AuthGuard } from './auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManageHomeComponent } from './manage/shared/manage-home/manage-home.component';
import { AuthManageGuard } from './auth-manage.guard';
import { ProductMainComponent } from './manage/product/product-main/product-main.component';
import { ProductManageComponent } from './manage/product/product-add/product-manage.component';
import { CartComponent } from './cart/cart.component';
import { ProductInfoComponent } from './product-info/product-info.component';
import { HomeComponent } from './home/home.component';
import { BillInfoComponent } from './bill-info/bill-info.component';
import { ProductSearchingComponent } from './product-searching/product-searching.component';
import { PurchaseMainComponent } from './manage/purchase/purchase-main/purchase-main.component';
import { PurchaseManageComponent } from './manage/purchase/purchase-manage/purchase-manage.component';
import { UserMainComponent } from './manage/user/user-main/user-main.component';
import { UserManageComponent } from './manage/user/user-manage/user-manage.component';

export const routes: Routes = [
  {
    path: '', component: DashboardComponent,
    children: [
      { path: '', component: HomeComponent, title: "Trang chủ" },
      {
        path: 'cart',
        loadComponent: () => import('./cart/cart.component').then(m => m.CartComponent),
        canActivate: [AuthGuard],
        title: 'Giỏ hàng'
      },
      {
        path: 'order',
        loadComponent: () => import('./order/order.component').then(m => m.OrderComponent),
        canActivate: [AuthGuard],
        title: "Đơn hàng"
      },
      {
        path: 'order/:id',
        loadComponent: () => import('./bill-info/bill-info.component').then(m => m.BillInfoComponent),
        canActivate: [AuthGuard],
        title: (route) => `Order #${route.params['id'].split('-')[0].toUpperCase()}`
      },
      {
        path: 'users',
        component: UserComponent,
        title: "Tài khoản"
      },
      {
        path: 'product-info/:id',
        loadComponent: () => import('./product-info/product-info.component').then(m => m.ProductInfoComponent),
        title: (route) => `Thông tin sản phẩm #${route.params['id'].split('-')[0].toUpperCase()}`
      },
      {
        path: 'product-searching',
        loadComponent: () => import('./product-searching/product-searching.component').then(m => m.ProductSearchingComponent),
        title: (route) => {
          return `Tìm kiếm sản phẩm: ${route.queryParams['keyword']}`
        }
      },
      {
        path: 'news-product',
        loadComponent: () => import('./product-searching/product-searching.component').then(m => m.ProductSearchingComponent),
        title: `Sản phẩm mới`
      }
    ]
  },
  { path: 'login', component: LoginComponent, title: "Đăng nhập" },
  {
    path: 'manage', canActivate: [AuthManageGuard], component: ManageHomeComponent,
    children: [
      { path: '', component: ProductMainComponent, title: "Danh sách sản phẩm" },
      { path: 'products', component: ProductMainComponent, title: "Danh sách sản phẩm" },
      { path: 'products/add', component: ProductManageComponent, title: "Tạo mới sản phẩm" },
      {
        path: 'products/:id',
        component: ProductManageComponent,
        title: (route) => `Chi tiết sản phẩm #${route.params['id'].split('-')[0].toUpperCase()}`
      },
      {
        path: 'purchase',
        component: PurchaseMainComponent,
        title: "Danh sách đơn nhập hàng"
      },
      { path: 'purchase/add', component: PurchaseManageComponent, title: "Tạo mới đơn nhập hàng" },
      { path: 'users', 
        component: UserMainComponent,
        title: "Danh sách khách hàng"
      },
      { path: 'users/add', 
        component: UserManageComponent,
        title: "Thêm khách hàng mới"
      }
    ]
  },
];
