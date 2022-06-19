import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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
    DashboardAdminRoutingModule
  ]
})
export class DashboardAdminModule { }
