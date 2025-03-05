// app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './auth.guard';
import { AdminComponent } from './components/admin/admin.component';

export const routes: Routes = [
    { 
      path: '', 
      component: HomeComponent, 
      canActivate: [AuthGuard] 
    },
    { 
      path: 'login', 
      component: LoginComponent 
    },
    { 
      path: 'register', 
      component: RegisterComponent 
    },
    {
      path:'admin',
      component:AdminComponent
    },
    { 
      path: '**', 
      redirectTo: '' 
    }
];