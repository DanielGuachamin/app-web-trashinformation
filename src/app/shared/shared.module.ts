import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsfilterPipe } from 'src/app/pipes/newsfilter.pipe';
import { VideosfilterPipe } from 'src/app/pipes/videosfilter.pipe';
import { RecomensfilterPipe } from 'src/app/pipes/recomensfilter.pipe';


@NgModule({
  declarations: [
    NewsfilterPipe,
    VideosfilterPipe,
    RecomensfilterPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NewsfilterPipe,
    VideosfilterPipe,
    RecomensfilterPipe
  ]
})
export class SharedModule { }
