import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  readonly Root: string;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.Root = 'http://localhost:3002/';
    // this.Root = 'https://dfsf-pcax.onrender.com/';

  }

  // Helper method to create headers with auth token
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }
 
  get(uri: string) {
    return this.http.get(this.Root + uri);
  }

  post(uri: string, payload: object) {
    return this.http.post(this.Root + uri, payload);
  }

  delete(uri: string, payload: object) {
    return this.http.delete(this.Root + uri, { body: payload});
  }

  put(uri: string, payload: object) {
    return this.http.put(this.Root + uri, payload);
  }
}