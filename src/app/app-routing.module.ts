import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/authpages/login/login.component';
import { DashboardAdminComponent } from './components/adminpages/dashboard-admin/dashboard-admin.component';
import { DashboardUserComponent } from './components/userpages/dashboard-user/dashboard-user.component';
import { RegisterComponent } from './components/authpages/register/register.component';
import { RecoverPasswordComponent} from './components/authpages/recover-password/recover-password.component'
import { AuthenticationGuard } from './guards/authentication.guard';
import { AdminVerificationGuard } from './guards/admin-verification.guard';
import { ClientVerificationGuard } from './guards/client-verification.guard';



const routes: Routes = [
  {
    path: 'dashboard-admin',
    component: DashboardAdminComponent,
    canActivate: [AuthenticationGuard, AdminVerificationGuard]
  },
  { 
    path: 'dashboard-user', 
    component: DashboardUserComponent,
    canActivate: [AuthenticationGuard, ClientVerificationGuard]
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
  },
  { 
    path: '', 
    redirectTo: 'login',
    pathMatch: 'full'
  },
  { 
    path: '**', 
    redirectTo: 'login',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
