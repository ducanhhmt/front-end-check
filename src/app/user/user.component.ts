import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { changeUserAddressRequest, updatePasswordRequest, updateUserProfileRequest, UserRespone } from '../interface/interfaceResponeAPI';
import { Observable } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { ApiServicesService } from '../services/api-services.service';
import { ProductRealTimeServices } from '../services/product-realtime';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserComponent implements OnInit {

  activeTab: string = 'profile';
  userLogin$!: Observable<UserRespone>;
  showAddressModal: boolean = false;
  editingIndex: number | null = null;
  confirmDeleteIndex: number | null = null;
  passwordForm = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  }, { validators: this.checkPasswordMatch });

  userformData = this.fb.group({
    id: ['', Validators.required],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['',],
    phone: ['', [
      Validators.required,
      Validators.pattern(/^[0-9]{10}$/)
    ]],
    gender: [false],
    birthday: [''],
    role: [''],
  });

  addressForm = this.fb.group({
    name: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    address: ['', Validators.required]
  });
  addressList: any[] = [];
  constructor(
    private router: Router,
    private apiServices: ApiServicesService,
    private dataService: ProductRealTimeServices,
    private fb: FormBuilder,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
    this.userLogin$ = this.dataService.userLogin$;
    this.userLogin$.subscribe(user => {
      this.userformData.patchValue({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        birthday: this.formatDate(user.birthday),
      });
      this.addressList = user.lstAddress ? user.lstAddress : [];
    });
  }

  setActive(tab: string) {
    this.activeTab = tab;
  }
  
  formatDate(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    // Dùng UTC methods để tránh lệch timezone
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /// tab thông tin cá nhân
  updateProfile() {
    if (this.userformData.invalid) {
      return;
    }
    const formValue = this.userformData.value;
    const payload: updateUserProfileRequest = {
      id: formValue.id ?? null,
      firstName: formValue.firstName ?? '',
      lastName: formValue.lastName ?? '',
      email: formValue.email ?? '',
      phone: formValue.phone ?? '',
      gender: formValue.gender ?? false,
      birthday: new Date(formValue.birthday ?? ''),
    };
    this.apiServices.updateUserProfile(payload).subscribe({
      next: () => {
        console.log('Cập nhật thành công');
        this.message.success('Cập nhật thông tin cá nhân thành công!');
      },
      error: (err: any) => {
        console.error('Lỗi cập nhật:', err);
        this.message.error('Có lỗi xảy ra khi cập nhật thông tin cá nhân.');
      }
    });
  }
  /// tab địa chỉ
  openAddressModal(index?: number) {
    if (index !== undefined) {
      this.editingIndex = index;
      const item = this.addressList[index];
      this.addressForm.patchValue({
        name: item.name,
        phone: item.phone,
        address: item.address
      });
    } else {
      this.editingIndex = null;
    }
    this.showAddressModal = true;
  }

  /// tab địa chỉ - xóa với popconfirm
  requestRemoveAddress(index: number) {
    if (index === 0) return;
    this.confirmDeleteIndex = index;
  }

  confirmRemoveAddress() {
    if (this.confirmDeleteIndex === null || this.confirmDeleteIndex === 0) return;
    this.addressList = this.addressList.filter((_, i) => i !== this.confirmDeleteIndex);
    this.confirmDeleteIndex = null;
    const payload: changeUserAddressRequest = {
      id: this.userformData.value.id ?? null,
      address: JSON.stringify(this.addressList)
    };
    this.updateAddress(payload);
  }

  cancelRemoveAddress() {
    this.confirmDeleteIndex = null;
  }

  closeAddressModal() {
    this.showAddressModal = false;
    this.editingIndex = null;
  }

  submitAddress() {
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }
    const value = this.addressForm.value;
    const newAddress = {
      name: value.name,
      phone: value.phone,
      address: value.address,
    };
    if (this.editingIndex !== null) {
      this.addressList[this.editingIndex] = newAddress;
    } else {
      this.addressList = [...this.addressList, newAddress];
    }
    const payload: changeUserAddressRequest = {
      id: this.userformData.value.id ?? null,
      address: JSON.stringify(this.addressList)
    };
    this.updateAddress(payload);
  }
  updateAddress(payload: changeUserAddressRequest) {
    this.apiServices.updateUserAddress(payload).subscribe({
      next: (data: any) => {
        console.log('Cập nhật địa chỉ thành công:', data);
        this.message.success('Cập nhật địa chỉ thành công!');
        this.closeAddressModal();
      },
      error: (err: any) => {
        this.message.error('Có lỗi xảy ra khi cập nhật địa chỉ.:', err);
        this.closeAddressModal();
      }
    }); 
    this.closeAddressModal();
  }
  /// tab đổi mật khẩu
  checkPasswordMatch(group: any) {
    const newPass = group.get('newPassword')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return newPass === confirm ? null : { notMatch: true };
  }

  submitPassword() {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    console.log(this.passwordForm.value);
    const payload : updatePasswordRequest = {
      id: this.userformData.value.id ?? null,
      currentPassword: this.passwordForm.value.currentPassword ?? '',
      newPassword: this.passwordForm.value.newPassword ?? ''
    }
    this.apiServices.updateUserPassword(payload).subscribe({
      next: (data: any) => {
        console.log('Cập nhật mật khẩu thành công:', data);
        this.message.success('Cập nhật mật khẩu thành công!');
        this.passwordForm.reset();
      },
      error: (err: any) => {
        console.error('Lỗi cập nhật mật khẩu:', err);
        this.message.error('Có lỗi xảy ra khi cập nhật mật khẩu.');
      }
    });  
    // call API đổi mật khẩu ở đây
  }
}
