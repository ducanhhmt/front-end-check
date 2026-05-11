export interface LoginResponse {
  name: string;
  role: string;
  token: string;
  isLogin: boolean;
}

export interface CategoryResponse {
  id: number;
  name: string;
  groups: Group[];
}
export interface Group {
  title: string;
  items: string[];
}

export interface ProductAdminDetailRespone {
  id: number;
  name: string;
  series: string;
  nxbId: number;
  categoriesId: number;
  weight: number;
  importPrice: number;
  price: number;
  publisherPrice: number;
  quantity: number;
  discount: number;
  dateCreated: Date;
  description: string;
  images: string[];
}

export interface ProductUserDetailRespone {
  id: number;
  name: string;
  series: string;
  nxbId: number;
  categoriesId: number;
  weight: number;
  price: number;
  publisherPrice: number;
  quantity: number;
  discount: number;
  description: string;
  images: string[];
}

export interface ProductAdminListing{
  id: string;
  name: string;
  categoriesId: number;
  categoriesName: string;
  nxbId: number;
  publisherName: string;
  quantity: number;
  images: string[];
}

export interface ProductUserListing{
  id: string;
  name: string;
  price: number;
  publisherPrice: number;
  discount: number;
  quantity: string;
  images: string[];
}

export interface ProductAdminFilterRespone {
  products: ProductAdminListing[];
  pageCount: number;
  totalRecords: number;
}

export interface ProductAdminPurchaseFilterRespone{
  id: string;
  name: string;
  importPrice: number;
  quantity: number;
  images: string;
}

export interface ProductUserFilterRespone {
  products: ProductUserListing[];
  pageCount: number;
  totalRecords: number;
}

export interface ProductAdminFilterRequest {
  keyword: string | null;
  categoryId: number | null;
  nxbId: number | null; 
  stock: string;
  pagesize: number;
  pageIndex: number;
}

export interface ProductUserFilterRequest {
  keyword: string | null;
  categoryId: number | null;
  nxbId: number | null; 
  stock: string;
  minPrice: number | null;
  maxPrice: number | null;
  pagesize: number;
  pageIndex: number;
}

export interface ProductAdminPurchaseFilterRequest {
  keyword: string | null; 
  pageIndex: number | 1;
  pageSize: number | 10;
}

export interface ProductAdminPurchaseFilterRespone{
  id: string;
  name: string;
  importPrice: number;
  quantity: number;
  images: string;
}

export interface ImageItem {
  file: File;      // file gốc (để gửi lên backend)
  preview: string; // ảnh dạng base64 (để hiển thị preview)
  url?: string;      // url sau khi upload thành công
  //name:string;
}

export interface UploadResponse {
  message: string;
  totalFiles: number;
  filePaths: string[];
}

export enum UploadType {
  User = 0,
  Product = 1
}

export interface PreviewImage {
  /** URL thật (sau upload) hoặc blob preview */
  src: string;
  /** Tiêu đề hiển thị trong lightbox (tuỳ chọn) */
  caption?: string;
}

export interface CartItem {
  id: number;
  productId: string;  // UUID
  name: string;
  price: number;
  publisherPrice: number;
  cartQuantity: number;
  image: string;
  soldOut: boolean;
  lowStock: boolean;
  stockQuantity: number;
  selected: boolean;
}

export interface CartItemRequest {
  productId: string | null;
  userId: string | null;
  quantity: number;
}

///=================== ORDER ==================//
export interface OrderPayload {
  userId: string | null;
  userName : string ;
  address: string;
  phone: string;
  shippingPrice: number;
  totalPrice: number;
  discountPrice : number;
  items: OrderItem[];
}

export interface OrderItem {
  productId: string;
  quantity: number;
}

export interface BillStateSummary {
  all: number;
  processing: number;
  shipping: number;
  completed: number;
  cancelled: number;
}

export interface GetAllBillRequest {
  userId: string | null;
  pagesize: number;
  pageIndex: number;
  state: number | null;
}

export interface GetAllUserBillResponse {
  items: BillResponse[];
  pageCount: number;
}

export interface BillResponse {
  id: string;
  state: number;
  totalPrice: number;
  itemsCount: number;
  dateCreated: Date;
  items: PreviewBillItem;
}

export interface PreviewBillItem{
  name: string;
  thumbnail: string;
}

export interface BillItem {
  id: string;
  billId: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
  importPrice: number;
  totalPrice: number;
  thumbnail: string;
}

///=================== User ==================//
export interface UserRespone {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  lstAddress: string[] | null;
  gender: boolean;
  birthday: Date;
  // avatar: string;
}

export interface updateUserProfileRequest {
  id: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: boolean;
  birthday: Date;
}

export interface updatePasswordRequest {
  id: string | null;
  currentPassword: string;
  newPassword : string;
}

export interface changeUserAddressRequest {
  id: string | null;
  address: string;
}

///=================== Supplier ==================//
export interface SupplierViewResponse {
  id: number;
  name: string;
}
export interface SupplierInfoResponse {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  debt: number;
  totalOrders: number;
  totalAmount: number;
}
///=================== Purchase ==================//



export interface PurchaseResponse {
  data: PurchaseViewResponse[];
  totalRecords: number;
  pageCount: number;
}

export interface PurchaseViewResponse {
  id:string;
  userCreated: string;
  supplierName: string;
  description: string;
  importPrice: number;
  dateCreated: Date;
  state: number;
}
export interface PurchaseDetailResponse {
  id:string;
  userCreated: string;
  supplierId: number;
  description: string;
  importPrice: number;
  purchaseItems: PurchaseItemResponse[];
  dateCreated: Date;
  state: number;
}
export interface PurchaseItemResponse {
  productId: string;
  productname: string;
  images: string;
  importPrice: number;
  quantity:number;
  totalPrice: number;
}
export interface PurchaseOrderRequest {
  id : string | null;
  userCreated : string;
  supplierId : number ;
  ImportPrice : number;
  purchaseItems : PurchaseItemRequest[];
  description : string;
  //Discount : number;
  dateCreated: Date;
  State : number;
}

export interface PurchaseItemRequest {
  purchaseId: string;
  productId: string;
  importPrice: number;
  quantity: number;
  totalPrice: number;
}