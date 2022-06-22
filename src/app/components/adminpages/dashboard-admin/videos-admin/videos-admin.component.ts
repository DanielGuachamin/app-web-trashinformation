import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DataApiService } from 'src/app/services/data-api.service';
import { Video } from 'src/app/modelos/video';

@Component({
  selector: 'app-videos-admin',
  templateUrl: './videos-admin.component.html',
  styleUrls: ['./videos-admin.component.scss'],
})
export class VideosAdminComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('demoYouTubePlayer')
  demoYouTubePlayer: ElementRef<HTMLDivElement>;
  videoWidth: number | undefined;
  videoHeight: number | undefined;

  formVideo: FormGroup;
  enumVideos: number = 0;
  videos: Video[] = [];

  constructor(
    private dataControl: DataApiService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {
    this.formVideo = new FormGroup({
      title: new FormControl(),
      category: new FormControl(),
      prevImg: new FormControl(),
      author: new FormControl(),
      url: new FormControl(),
      id: new FormControl(),
      urlID: new FormControl(),
    });
  }

  ngOnInit(): void {
    this.dataControl.getVideos().subscribe((videos) => {
      this.videos = videos;
      this.enumVideos = videos.length;
    });
  }

  ngAfterViewInit(): void {
    console.log('afterinit');
    setTimeout(() => {
      this.onResize();
      window.addEventListener('resize', this.onResize);
    }, 1000);
  }

  onResize = (): void => {
    // Automatically expand the video to fit the page up to 1200px x 720px
    this.videoWidth = Math.min(
      this.demoYouTubePlayer.nativeElement.clientWidth,
      1200
    );
    this.videoHeight = this.videoWidth * 0.6;
    this._changeDetectorRef.detectChanges();
  };

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onResize);
  }

  async onSubmitAddVideo() {
    const videoID = this.getVideoId(this.formVideo.get('url').value);
    const idAdd = this.comprobarIdVideo();
    const urlImage = `https://img.youtube.com/vi/${videoID}/maxresdefault.jpg`;

    this.formVideo.controls['prevImg'].setValue(urlImage);
    this.formVideo.controls['urlID'].setValue(videoID);
    this.formVideo.controls['id'].setValue(idAdd);
    await this.dataControl.addVideo(this.formVideo.value, idAdd);
    console.log('formulario video: ', this.formVideo.value);
    this.formVideo.reset();
  }

  getVideoId(url: string) {
    const urlEdited = url.slice(-11);
    return urlEdited;
  }

  comprobarIdVideo() {
    const listVideo = this.videos;
    const idNoticiaBD = listVideo.map((item) => item.id);
    const idMod = this.formVideo.get('id').value;
    let idAdd;
    for (let item of idNoticiaBD) {
      if (item == idMod) {
        idAdd = idMod;

        return idAdd;
      }
    }
    idAdd = `${this.enumVideos + 1}v`;
    return idAdd;
  }

  async deleteVideoById(id: any) {
    await this.dataControl.deleteElement(id, 'Videos');
  }

  fillFormVideo(id: any) {
    this.dataControl.modifiedVideo(id).then((response: any) => {
      this.formVideo.setValue(response);
    });
  }

  clearForm() {
    this.formVideo.reset();
  }
}
