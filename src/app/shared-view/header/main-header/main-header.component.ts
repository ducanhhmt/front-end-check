import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiServicesService } from '../../../services/api-services.service';
import { NewsRealTimeSearchService } from '../../../services/news-real-time-search.service';
import { signalRService } from '../../../services/signalR.service';
import { HeaderCategoryComponent } from '../header-category/header-category.component';
import { HeaderUserOptionComponent } from '../header-user-option/header-user-option.component';
import { AuthServicesService } from '../../../services/auth-services.service';

@Component({
  selector: 'app-main-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderCategoryComponent, HeaderUserOptionComponent],
  templateUrl: './main-header.component.html',
  styleUrl: './main-header.component.css'
})
export class MainHeaderComponent implements OnInit {
  categories: any = [];
  isManager: boolean = false;
  searchKeyword: string = '';

  constructor(
    private apiService: ApiServicesService,
    private signalRService: signalRService,
    private newsRealTimeSearchService: NewsRealTimeSearchService,
    private router: Router,
    private authService: AuthServicesService
  ) { }

  ngOnInit(): void {
    this.getMenuCategories()
    this.checkIsManager();
  }

  async search() {
    if (!this.searchKeyword) return;
    // const requestId = crypto.randomUUID();
    // this.newsRealTimeSearchService.setLoading(true);
    // await this.signalRService.joinGroup(requestId);
    //const result = await this.apiService.searching(this.searchKeyword, requestId);
    //await this.apiService.searching(this.searchKeyword, requestId);
    this.router.navigate(['/product-searching'], { queryParams: { keysearch: this.searchKeyword } });
  }

  getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }

  getMenuCategories() {
    this.apiService.menuCategories().subscribe({
      next: (response) => {
        this.categories = response;
        console.log('Categories:', this.categories);
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      }
    });
  }

  onLogout(){
     this.isManager = false;
  }

  checkIsManager() {
     const isAdmin = this.authService.isManager();
     if(isAdmin) {
       this.isManager = true;
     } else {
       this.isManager = false;
     }
  }
}
