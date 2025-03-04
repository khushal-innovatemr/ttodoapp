// services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API_URL = 'https://dfsf-pcax.onrender.com/auth';

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, { email, password});
  }

  register(email: string, password: string, role: string): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, { email, password,role});
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('token');
    }
    return false;
  }
  
  // Get the token for auth header
  getToken(): string | null {
    return localStorage.getItem('token');
  }
}