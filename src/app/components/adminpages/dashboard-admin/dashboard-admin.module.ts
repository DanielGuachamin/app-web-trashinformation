import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { YouTubePlayerModule } from "@angular/youtube-player";

import { DashboardAdminRoutingModule } from './dashboard-admin-routing.module';
import { NewsAdminComponent } from './news-admin/news-admin.component';
import { VideosAdminComponent } from './videos-admin/videos-admin.component';
import { RecommendationsAdminComponent } from './recommendations-admin/recommendations-admin.component';
import { ContactsAdminComponent } from './contacts-admin/contacts-admin.component';
import { SuggestionsAdminComponent } from './suggestions-admin/suggestions-admin.component';

import { NewsfilterPipe } from '../../../pipes/newsfilter.pipe';
import { VideosfilterPipe } from '../../../pipes/videosfilter.pipe';
import { RecomensfilterPipe } from '../../../pipes/recomensfilter.pipe';

@NgModule({
  declarations: [
    NewsAdminComponent,
    VideosAdminComponent,
    RecommendationsAdminComponent,
    ContactsAdminComponent,
    SuggestionsAdminComponent,
    NewsfilterPipe,
    VideosfilterPipe,
    RecomensfilterPipe
  ],
  imports: [
    CommonModule,
    DashboardAdminRoutingModule,
    MaterialModule,
    FormsModule, 
    ReactiveFormsModule,
    YouTubePlayerModule
  ]
})
export class DashboardAdminModule { }
