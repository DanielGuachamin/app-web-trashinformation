import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { YouTubePlayerModule } from "@angular/youtube-player";

import { DashboardUserRoutingModule } from './dashboard-user-routing.module';
import { NewsUserComponent } from './news-user/news-user.component';
import { VideosUserComponent } from './videos-user/videos-user.component';
import { RecommendatiosUserComponent } from './recommendatios-user/recommendatios-user.component';
import { ContactsUserComponent } from './contacts-user/contacts-user.component';
import { SuggestionsUserComponent } from './suggestions-user/suggestions-user.component';
import { ProfileUserComponent } from './profile-user/profile-user.component';


@NgModule({
  declarations: [
    NewsUserComponent,
    VideosUserComponent,
    RecommendatiosUserComponent,
    ContactsUserComponent,
    SuggestionsUserComponent,
    ProfileUserComponent
  ],
  imports: [
    CommonModule,
    DashboardUserRoutingModule,
    MaterialModule,
    FormsModule, 
    ReactiveFormsModule,
    YouTubePlayerModule
  ]
})
export class DashboardUserModule { }
