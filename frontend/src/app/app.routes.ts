// app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AdminComponent } from './components/admin/admin.component';
import { RedirectGuard } from './redirect.guard';

export const routes: Routes = [
    { 
      path: '', 
      component: HomeComponent, 
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
    },
    { 
      path: '**', 
      redirectTo: '' 
    }
];
