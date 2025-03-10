import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AdminComponent } from './components/admin/admin.component';
import { AuthGuard } from './auth.guard';
import { RoleGuard } from './role.guard';
import { RedirectGuard } from './redirect.guard';

export const routes: Routes = [
  { 
    path: '', 
    component: HomeComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'login', 
    component: LoginComponent,
    canActivate: [RedirectGuard]
  },
  { 
    path: 'register', 
    component: RegisterComponent,
    canActivate: [RedirectGuard]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard,RoleGuard]
  },
];