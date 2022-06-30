import { Component, OnInit } from '@angular/core';
import { DataApiService } from 'src/app/services/data-api.service';
import { Recomendacion} from 'src/app/modelos/recomendacion'

@Component({
  selector: 'app-recommendatios-user',
  templateUrl: './recommendatios-user.component.html',
  styleUrls: ['./recommendatios-user.component.scss']
})
export class RecommendatiosUserComponent implements OnInit {

  recomendaciones: Recomendacion[] = [];

  constructor(private dataControl: DataApiService) { }

  ngOnInit(): void {
    this.dataControl.getRecommendations().subscribe((recomendaciones) => {
      this.recomendaciones = recomendaciones;
    });
  }

}
