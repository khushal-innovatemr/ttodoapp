// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthInterceptor } from '../auth.interceptor';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { AuthService } from './app/services/auth.service';
import { RedirectGuard } from './app/redirect.guard';
import { RoleGuard } from './app/role.guard';
import { AuthGuard } from './app/auth.guard';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(
      withInterceptors([AuthInterceptor]),
    ),
    provideRouter(routes),
    AuthGuard, RoleGuard, RedirectGuard, AuthService,
  ]
}).catch(err => console.error(err));