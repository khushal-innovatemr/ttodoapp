import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './src/app/services/auth.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const AuthInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  if (req.url.includes('/api/auth/')) {
    return next(req);
  }

  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
