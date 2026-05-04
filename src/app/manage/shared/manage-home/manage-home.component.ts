import { Component } from '@angular/core';
import { ProductMainComponent } from '../../product/product-main/product-main.component';
import { ManageHeaderComponent } from '../header/manage-header.component';
import { ManageSidebarComponent } from '../manage-sidebar/manage-sidebar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-manage-home',
  standalone: true,
  imports: [ProductMainComponent,ManageHeaderComponent,ManageSidebarComponent,RouterModule],
  templateUrl: './manage-home.component.html',
  styleUrl: './manage-home.component.css'
})
export class ManageHomeComponent {

}
