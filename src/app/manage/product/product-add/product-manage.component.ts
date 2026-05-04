import { Component, OnInit } from '@angular/core';
import { ImageItem, UploadType } from '../../../interface/interfaceResponeAPI';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiServicesService } from '../../../services/api-services.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductRealTimeServices } from '../../../services/product-realtime';
import { Observable } from 'rxjs';
import { MockDataService } from '../../../services/mockdata.service';
import { ImagePreviewComponent } from '../../shared/image-preview/image-preview.component';

@Component({
  selector: 'app-product-add',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule,ImagePreviewComponent],
  templateUrl: './product-manage.component.html',
  styleUrl: './product-manage.component.css'
})
export class ProductManageComponent implements OnInit {
  nxbList$!: Observable<any[]>;
  category$!: Observable<any[]>;
  images: ImageItem[] = [];
  productForm!: FormGroup;
  // ✅ Phân biệt Add / Edit
  productId: string | null = null;
  isEditMode = false;
  isLoading = false;
  // ✅ Drag & drop reorder state
  dragIndex: number | null = null;
  dragOverIndex: number | null = null;
  previewTrigger: { index: number } | null = null;
  
  constructor(
    private services: ApiServicesService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private dataService: ProductRealTimeServices,
    private mockData: MockDataService
  ) { }
  ngOnInit(): void {
    this.nxbList$ = this.mockData.ObservableNXB();
    this.category$ = this.dataService.category$;
    this.dataService.loadCategories();
    this.initForm();
    // ✅ Đọc id từ route
    this.productId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.productId;
    if (this.isEditMode) {
      this.loadProduct(this.productId!);
    }
    else {
    }
  }

  private initForm(): void {
    this.productForm = this.fb.group({
      id: [""],
      name: ['', [Validators.required, Validators.maxLength(255)]],
      series: [''],
      weight: [0, [Validators.min(0)]],
      nxbId: [0, [Validators.required, Validators.min(1)]],
      categoriesId: [0, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]],
      publisherPrice: [0, [Validators.min(0)]],
      importPrice: [0, [Validators.min(0)]],
      quantity: [0, [Validators.required, Validators.min(0)]],
      discount: [0, [Validators.min(0), Validators.max(100)]],
      dateCreated: [new Date().toISOString()],
      description: ['', [Validators.required]],
      thumbnailIMG: ['', [Validators.required]]
    });
  }
  private loadProduct(id: string): void {
    this.isLoading = true;
    this.services.AdminGetproductbyid(id).subscribe({
      next: (product: any) => {
        // Fill form
        this.productForm.patchValue({
          id: product.id,
          name: product.name,
          series: product.series,
          weight: product.weight,
          nxbId: product.nxbId,
          categoriesId: product.categoriesId,
          price: product.price,
          publisherPrice: product.publisherPrice,
          importPrice: product.importPrice,
          quantity: product.quantity,
          discount: product.discount,
          dateCreated: product.dateCreated,
          description: product.description,
          thumbnailIMG: product.images
        });
        this.images = product.images.map((url: string) => ({
          file: null as any,
          preview: url,
          url: url
        }));
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  // chọn file
  onFileChange(event: any) {
    const files = event.target.files;
    this.handleFiles(files);
    // 🔥 reset input (fix chọn lại cùng file)
    event.target.value = '';
  }

  // drag over
  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  // drop file
  onDrop(event: DragEvent) {
    event.preventDefault();
    if (this.dragIndex !== null) return;
    if (event.dataTransfer?.files?.length) {
      this.handleFiles(event.dataTransfer.files);
    }
  }

  handleFiles(files: FileList) {
    const startIndex = this.images.length;
    const validFiles: File[] = [];
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const preview = URL.createObjectURL(file);
      this.images.push({
        file,
        preview,
        url: undefined
      });
      validFiles.push(file);
    });
    // update UI ngay
    this.images = [...this.images];
    // 🚀 gọi upload ngầm (tách riêng)
    if (validFiles.length) {
      this.uploadImagesBackground(validFiles, startIndex);
    }
  }
  // xoá ảnh
  removeImage(index: number) {
    // 🔥 cleanup memory
    URL.revokeObjectURL(this.images[index].preview);
    this.images = this.images.filter((_, i) => i !== index);
  }

  // lấy file gửi backend
  getFiles(): File[] {
    return this.images
      .map(img => img.file)
      .filter((file): file is File => file !== null && file !== undefined);
  }

  private uploadImagesBackground(files: File[], startIndex: number) {
    this.services.uploadImage(files, UploadType.Product) // 1 = Product
      .subscribe({
        next: (res: any) => {
          res.filePaths.forEach((url: string, index: number) => {
            const targetIndex = startIndex + index;

            if (this.images[targetIndex]) {
              this.images[targetIndex].url = url;
            }
          });
          this.images = [...this.images];
          // ✅ cập nhật vào form
          this.productForm.patchValue({
            thumbnailIMG: this.getImageUrlsString()
          });
        },
        error: (err: any) => {
          console.error('Upload lỗi', err);
        }
      });
  }

  onSubmit() {
    this.syncThumbnailToForm();
    const payload = this.productForm.value;
    console.log('Payload gửi BE:', payload);

    if (this.isEditMode) {
      this.services.updateProduct(payload).subscribe({
        next: (res) => {
         console.log('Cập nhật thành công', res);
            //this.dataService.updateProduct(res);
            this.router.navigate(['/manage/products']);          
        },
        error: (err) => console.error('Lỗi cập nhật', err)
      });
    }
    else {
      this.services.addProduct(payload).subscribe({
        next: (res) => {
          console.log('Thêm sản phẩm thành công', res);
          //this.dataService.addProduct(res); // cập nhật realtime
          this.router.navigate(['/manage/products']);
        },
        error: (err) => {
          console.error('Lỗi khi thêm sản phẩm', err);
        }
      });
    }
  }

  getImageUrlsString(): string {
    return this.images
      .filter(img => img.url)
      .map(img => img.url)
      .join(',');
  }
  ///Convert từ array về string kiểu nối chuỗi ///
   private syncThumbnailToForm() {
    this.productForm.patchValue({
      thumbnailIMG: this.getImageUrlsString()
    });
  }

  // ─── Drag & drop REORDER ─────────────────────────────────────────────────────
 
  /** Bắt đầu kéo một ảnh */
  onImageDragStart(event: DragEvent, index: number) {
    this.dragIndex = index;
    // Dùng ghost image mặc định của browser
    event.dataTransfer!.effectAllowed = 'move';
  }
 
  /** Kéo qua một slot khác → đánh dấu vị trí target */
  onImageDragEnter(event: DragEvent, index: number) {
    event.preventDefault();
    if (this.dragIndex === null || this.dragIndex === index) return;
    this.dragOverIndex = index;
  }
 
  onImageDragOverItem(event: DragEvent) {
    event.preventDefault(); // cần thiết để cho phép drop
    event.dataTransfer!.dropEffect = 'move';
  }
 
  /** Thả ảnh → hoán đổi vị trí */
  onImageDrop(event: DragEvent, targetIndex: number) {
    event.preventDefault();
    event.stopPropagation(); // không trigger onDrop của upload-box
 
    if (this.dragIndex === null || this.dragIndex === targetIndex) {
      this.resetDragState();
      return;
    }
 
    // Swap
    const updated = [...this.images];
    const [dragged] = updated.splice(this.dragIndex, 1);
    updated.splice(targetIndex, 0, dragged);
    this.images = updated;
 
    this.syncThumbnailToForm();
    this.resetDragState();
  }
 
  onImageDragEnd() {
    this.resetDragState();
  }
 
  private resetDragState() {
    this.dragIndex = null;
    this.dragOverIndex = null;
  }
  //-------------------------------- PREVIEW  --------------------------------------
    // ✅ Preview images cho LightGallery (tự động sync khi images thay đổi)
  openPreview(index: number) {
    this.previewTrigger = { index }; // object mới mỗi lần → luôn trigger ngOnChanges
  }
}
