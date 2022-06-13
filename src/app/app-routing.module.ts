import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardAdminComponent } from './components/dashboard-admin/dashboard-admin.component';
import { DashboardUserComponent } from './components/dashboard-user/dashboard-user.component';
import { RegisterComponent } from './components/register/register.component';
import { RecoverPasswordComponent} from './components/recover-password/recover-password.component'
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

const routes: Routes = [
  { 
    path: '', 
    pathMatch: 'full', 
    redirectTo: '/login' 
  },
  {
    path: 'dashboard-admin',
    component: DashboardAdminComponent,
    ...canActivate(() => redirectUnauthorizedTo(['/login']))
  },
  { 
    path: 'dashboard-user', 
    component: DashboardUserComponent,
    ...canActivate(() => redirectUnauthorizedTo(['/login']))
  },
  { 
    path: 'register', 
    component: RegisterComponent 
  },
  { 
    path: 'login', 
    component: LoginComponent 
  },
  { 
    path: 'recover-password', 
    component: RecoverPasswordComponent 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
