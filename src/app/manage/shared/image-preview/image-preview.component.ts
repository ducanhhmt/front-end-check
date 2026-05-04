import { CommonModule } from '@angular/common';
import { AfterViewChecked, Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { ImageItem } from '../../../interface/interfaceResponeAPI';
import { LightgalleryModule } from 'lightgallery/angular';
import lgZoom from 'lightgallery/plugins/zoom';
import { InitDetail } from 'lightgallery/lg-events';
import { LightGallery } from 'lightgallery/lightgallery';

@Component({
  selector: 'app-image-preview',
  standalone: true,
  imports: [CommonModule, LightgalleryModule],
  templateUrl: './image-preview.component.html',
  styleUrl: './image-preview.component.css'
})
export class ImagePreviewComponent implements OnChanges, AfterViewChecked, OnDestroy {

  @Input() images: ImageItem[] = [];
  @Input() openTrigger: { index: number } | null = null; // ✅ object để luôn trigger ngOnChanges

  private lgInstance: LightGallery | null = null; // ✅ null thay vì !
  private needRefresh = false;
  private pendingOpenIndex: number | null = null;
  private isDestroyed = false; // ✅ flag chặn callback sau destroy
  settings = {
    counter: true,
    plugins: [lgZoom],
    dynamic: false,
  };

  onInit = (detail: InitDetail): void => {
    if (this.isDestroyed) return; // ✅ callback đến sau destroy → bỏ qua
    this.lgInstance = detail.instance;
    if (this.pendingOpenIndex !== null) {
      this.lgInstance.openGallery(this.pendingOpenIndex);
      this.pendingOpenIndex = null;
    }
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['images']) {
      this.needRefresh = true;
    }
    // ✅ object mới mỗi lần → luôn fire dù click cùng index
    if (changes['openTrigger'] && this.openTrigger !== null) {
      const index = this.openTrigger.index;
      if (this.lgInstance) {
        // ✅ refresh trước rồi mới open để đảm bảo danh sách ảnh đã sync
        if (this.needRefresh) {
          this.lgInstance.refresh();
          this.needRefresh = false;
        }
        this.lgInstance.openGallery(index);
      } else {
        this.pendingOpenIndex = index;
      }
    }
  }

  ngAfterViewChecked(): void {
    if (this.needRefresh && this.lgInstance) {
      this.lgInstance.refresh();
      this.needRefresh = false;
    }
  }

  ngOnDestroy(): void {
    this.isDestroyed = true; // ✅ set trước tiên
    if (this.lgInstance) {
      try {
        this.lgInstance.closeGallery(); // ✅ đóng gallery trước nếu đang mở
        this.lgInstance.destroy();
      } catch (e) {
        // ✅ lightgallery DOM đã bị Angular xóa → ignore lỗi removeChild
      } finally {
        this.lgInstance = null;
      }
    }
  }
}