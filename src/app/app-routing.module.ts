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
import { PublicAuthenticationGuard } from './guards/public-authentication.guard';
import { NewsAdminComponent } from './components/adminpages/dashboard-admin/news-admin/news-admin.component';
import { VideosAdminComponent } from './components/adminpages/dashboard-admin/videos-admin/videos-admin.component';
import { RecommendationsAdminComponent } from './components/adminpages/dashboard-admin/recommendations-admin/recommendations-admin.component';
import { ContactsAdminComponent } from './components/adminpages/dashboard-admin/contacts-admin/contacts-admin.component';
import { SuggestionsAdminComponent } from './components/adminpages/dashboard-admin/suggestions-admin/suggestions-admin.component';



const routes: Routes = [
  {
    path: 'dashboard-admin',
    component: DashboardAdminComponent,
    children: [
      {
        path: '',
        component: NewsAdminComponent
      },
      {
        path: 'videos-admin',
        component: VideosAdminComponent
      },
      {
        path: 'recommendations-admin',
        component: RecommendationsAdminComponent
      },
      {
        path: 'contacts-admin',
        component: ContactsAdminComponent
      },
      {
        path: 'suggestions-admin',
        component: SuggestionsAdminComponent
      }
    ],
    canActivate: [AuthenticationGuard, AdminVerificationGuard]
  },
  { 
    path: 'dashboard-user', 
    component: DashboardUserComponent,
    canActivate: [AuthenticationGuard, ClientVerificationGuard]
  },
  { 
    path: 'register', 
    component: RegisterComponent,
    canActivate: [PublicAuthenticationGuard]
  },
  { 
    path: 'login', 
    component: LoginComponent
  },
  { 
    path: 'recover-password', 
    component: RecoverPasswordComponent,
    canActivate: [PublicAuthenticationGuard]
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
