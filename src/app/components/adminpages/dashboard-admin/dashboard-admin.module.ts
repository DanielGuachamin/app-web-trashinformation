import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DashboardAdminRoutingModule } from './dashboard-admin-routing.module';
import { NewsAdminComponent } from './news-admin/news-admin.component';
import { VideosAdminComponent } from './videos-admin/videos-admin.component';
import { RecommendationsAdminComponent } from './recommendations-admin/recommendations-admin.component';
import { ContactsAdminComponent } from './contacts-admin/contacts-admin.component';
import { SuggestionsAdminComponent } from './suggestions-admin/suggestions-admin.component';


@NgModule({
  declarations: [
    NewsAdminComponent,
    VideosAdminComponent,
    RecommendationsAdminComponent,
    ContactsAdminComponent,
    SuggestionsAdminComponent
  ],
  imports: [
    CommonModule,
    DashboardAdminRoutingModule,
    MaterialModule,
    FormsModule, 
    ReactiveFormsModule
  ]
})
export class DashboardAdminModule { }