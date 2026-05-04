import { Injectable } from '@angular/core';
import { ApiServicesService } from './api-services.service';
import { map, Observable } from 'rxjs';
import { LoginResponse } from '../interface/interfaceResponeAPI';

@Injectable({
  providedIn: 'root'
})
export class AuthServicesService {
  constructor(
    private services: ApiServicesService
  ) { }

  login(username: string, password: string): Observable<boolean> {
    const body = { account: username, password: password };
    return this.services.login(body).pipe(
      map((response: LoginResponse) => {
        if (response.isLogin) {
          const date = new Date();
          date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));
          document.cookie = `token=${response.token}; expires=${date.toUTCString()}; path=/`;
          document.cookie = `name=${response.name}; expires=${date.toUTCString()}; path=/`;
          return true;
        }
        return false;
      })
    );
  }

  logout() {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "name=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }

  isLoggedIn(): boolean {
    return document.cookie.includes("token=");
  }
  isManager(): boolean {
    const cookies = document.cookie.split(';');
    // const roleCookie = cookies.find(c => c.trim().startsWith('role='));
    // if (!roleCookie) return false;
    // const role = roleCookie.split('=')[1];
    // return role === 'Admin'; // admin = true, user = false
    const tokenCookie = cookies.find(c => c.trim().startsWith('token='));
    if (!tokenCookie) return false;

    const token = tokenCookie.split('=')[1];
    try {
      // Decode phần payload của JWT (phần thứ 2)
      const payload = JSON.parse(atob(token.split('.')[1]));
      // Tùy theo backend đặt tên claim role
      // .NET thường dùng: ClaimTypes.Role → key dài
      const role = payload['role'] || payload['Role'] || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      return role  !== 'User'; // admin = true, user = false
    } catch {
      return false;
    }
  }
}