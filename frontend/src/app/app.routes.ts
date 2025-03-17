import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AdminComponent } from './components/admin/admin.component';
import { RedirectGuard } from './redirect.guard';
import { AuthGuard } from './auth.guard';
import { RoleGuard } from './role.guard';
import { AdminGuard } from './admin.guard';
import { AdminRegisterComponent } from './components/admin-register/admin-register.component';

export const routes: Routes = [
  { 
    path: '', 
    component: HomeComponent, 
    canActivate:[AuthGuard,AdminGuard]
  },
  { 
    path: 'login', 
    component: LoginComponent,
    canActivate:[RedirectGuard]
  },
  { 
    path: 'register', 
    component: RegisterComponent, 
    canActivate:[RedirectGuard]
  },
  {
    path:'admin',
    component:AdminComponent,
    canActivate:[RoleGuard]
  },
  {
    path:'admin-create',
    component:AdminRegisterComponent,
    canActivate:[RoleGuard]
  },
  { 
    path: '**', 
    redirectTo: '' 
  }
];