import { Component } from '@angular/core';
import { AuthServicesService } from '../services/auth-services.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(
    private authService: AuthServicesService,
    private router: Router
  ) { }

  login() {
    const success = this.authService.login(this.username, this.password)
    .subscribe(result => {
      if (result) {
        this.router.navigate(['/']);
      } else {
        alert("Login failed");
      }
    });
  }
}
