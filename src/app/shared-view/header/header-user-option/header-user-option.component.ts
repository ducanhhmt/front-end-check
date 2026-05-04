import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthServicesService } from '../../../services/auth-services.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserRespone } from '../../../interface/interfaceResponeAPI';
import { Observable } from 'rxjs';
import { ProductRealTimeServices } from '../../../services/product-realtime';

@Component({
  selector: 'app-header-user-option',
  standalone: true,
  imports: [FormsModule,CommonModule,RouterModule],
  templateUrl: './header-user-option.component.html',
  styleUrl: './header-user-option.component.css'
})
export class HeaderUserOptionComponent implements OnInit {
  @Output() logoutEvent = new EventEmitter<void>();
  userNameLogin: string | null = null;
  userLogin$!: Observable<UserRespone>;
  constructor(
    private authservice: AuthServicesService,
    private router: Router,
    private dataService: ProductRealTimeServices
  ) { }
  ngOnInit(): void {
    if(this.authservice.isLoggedIn()) {
      this.userLogin$ = this.dataService.userLogin$;
      this.dataService.loadUserInfo();
      this.userLogin$.subscribe(user => {
        console.log('User info:', user);
      });
    }
    this.userNameLogin = this.getCookie('name');   
  }

  getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }

  Logout() {
    this.authservice.logout();
    this.userNameLogin = null;
     // 🔥 bắn event lên cha
    this.logoutEvent.emit();
    this.router.navigate(['/']);
  }
}
