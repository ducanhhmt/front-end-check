import { Component, DoCheck, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthServicesService } from '../services/auth-services.service';
import { signalRService } from '../services/signalR.service';
import { HomeComponent } from '../home/home.component';
import { FooterComponent } from '../shared-view/footer/footer.component';
import { MainHeaderComponent } from '../shared-view/header/main-header/main-header.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,FormsModule,MainHeaderComponent,HomeComponent,FooterComponent,RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements  OnInit {
  constructor(
    private signalR: signalRService
  ){}
  async ngOnInit()
  {
    await this.signalR.startConnection();
  }
}
