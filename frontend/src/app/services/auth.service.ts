// services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API_URL = 'http://localhost:3002/auth';

  constructor(private http: HttpClient, private router: Router) {}

  
  // Use this for non-auth endpoints
  private header_options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
    withCredentials: true
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, { email, password},this.header_options);
  }

  register(email: string, password: string, role: string): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, { email, password,role},this.header_options);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  AddUser(email: string, password: string, role: string): Observable<any> {
    return this.http.post(`${this.API_URL}/login/add`, { email, password, role });
  }

  getUsers(): Observable<any> {
    return this.http.get(`${this.API_URL}/login/users`);
  }

  viewUserTasks(userId: string): Observable<any> {
    return this.http.get(`${this.API_URL}/view/${userId}`);
  }
  deleteUsers(userId: string, payload: object): Observable<any> {
    return this.http.delete(`${this.API_URL}/login/delete`, { body: { userId } });
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