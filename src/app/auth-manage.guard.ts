import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { AuthServicesService } from './services/auth-services.service';
@Injectable({
    providedIn: 'root'
})
export class AuthManageGuard implements CanActivate {
    constructor(
        private authServices: AuthServicesService,
        private router: Router
    ) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
        if (this.authServices.isLoggedIn() && this.authServices.isManager()) {
            return true;
        }
        this.router.navigate(['/']);
        return false;
    }
}
