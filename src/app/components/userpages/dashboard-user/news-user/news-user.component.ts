import { Component, OnInit} from '@angular/core';
import { DataApiService } from 'src/app/services/data-api.service';
import { Noticia } from 'src/app/modelos/noticia';

@Component({
  selector: 'app-news-user',
  templateUrl: './news-user.component.html',
  styleUrls: ['./news-user.component.scss']
})
export class NewsUserComponent implements OnInit {

  noticias: Noticia[] = [];

  constructor(private dataControl: DataApiService) { }

  ngOnInit(): void {
    this.dataControl.getNoticias().subscribe((noticias) => {
      this.noticias = noticias;
    });
  }


}
