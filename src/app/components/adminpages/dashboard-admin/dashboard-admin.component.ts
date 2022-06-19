import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataApiService } from 'src/app/services/data-api.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.scss']
})
export class DashboardAdminComponent implements OnInit {

  constructor(
    private userService: UserService,
    private router: Router,
    private userControl: DataApiService
    ) { }

  ngOnInit(): void {
    //this.checkRolAdmin()
    /*
    this.userControl.getUser().subscribe(users => {
      console.log(users);
    })
    */
    
  }

  onClick(){
    this.userService.logout()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch(error => console.log(error));
  }

  async checkRolAdmin(){
    
    const email = this.userService.seeEmailUserAuth()
    const rol = await this.userControl.searchUserRol(email)
      console.log('Este usuario tiene rol desde dashboard-admin: ', rol)
      if(rol === 'cliente'){
        this.router.navigate(['/dashboard-user'])
      }
  }

}