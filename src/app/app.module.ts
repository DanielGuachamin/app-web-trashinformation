import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoginComponent } from './components/authpages/login/login.component';
import { RegisterComponent } from './components/authpages/register/register.component';
import { RecoverPasswordComponent } from './components/authpages/recover-password/recover-password.component';

import { DashboardAdminComponent } from './components/adminpages/dashboard-admin/dashboard-admin.component';
import { DashboardUserComponent } from './components/userpages/dashboard-user/dashboard-user.component';


import { ModalGeneralComponent } from './components/modal-general/modal-general.component';

import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideStorage,getStorage } from '@angular/fire/storage';

import  {HttpClientModule}  from "@angular/common/http";
import { FilterPipe } from './pipes/filter.pipe';
import { DashboardAdminModule } from './components/adminpages/dashboard-admin/dashboard-admin.module';




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardAdminComponent,
    DashboardUserComponent,
    RecoverPasswordComponent,
    ModalGeneralComponent,
    FilterPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpClientModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    DashboardAdminModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
