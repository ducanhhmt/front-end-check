import { Injectable } from '@angular/core';
import { ApiServicesService } from './api-services.service';
import { map, Observable, of } from 'rxjs';
import { LoginResponse } from '../interface/interfaceResponeAPI';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  constructor(
  ) { }
  NxbList = [
    { id: 1, name: 'NXB Kim Đồng' },
    { id: 2, name: 'NXB Trẻ' },
    { id: 3, name: 'NXB IPM' },
    { id: 4, name: 'NXB Phụ Nữ' },
    { id: 5, name: 'NXB Giáo Dục' },
  ]
  lstNXB() {
    return this.NxbList;
  }

  ObservableNXB(): Observable<any[]> {
    return of(this.NxbList); // ✅ Bọc array vào Observable
  }

  getNxbNameById(id: number): string {
    const nxb = this.NxbList.find(n => n.id === id);
    return nxb ? nxb.name : 'Unknown';
  }
}
