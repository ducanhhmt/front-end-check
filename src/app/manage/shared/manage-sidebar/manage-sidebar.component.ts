import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-manage-sidebar',
  standalone: true,
  imports: [CommonModule, NzMenuModule, NzIconModule,RouterModule],
  templateUrl: './manage-sidebar.component.html',
  styleUrl: './manage-sidebar.component.css'
})
export class ManageSidebarComponent {
  isCollapsed = false;
  toggle() {
    this.isCollapsed = !this.isCollapsed;
  }
}
