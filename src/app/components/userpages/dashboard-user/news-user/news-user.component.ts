import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog'

@Component({
  selector: 'app-news-user',
  templateUrl: './news-user.component.html',
  styleUrls: ['./news-user.component.scss']
})
export class NewsUserComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<NewsUserComponent>,
    @Inject(MAT_DIALOG_DATA) public message: String
  ) { }

  ngOnInit(): void {
  }

  onClickNo(){
    this.dialogRef.close
  }

}
