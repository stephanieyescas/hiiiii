import { Component, OnInit, ViewChild } from '@angular/core';
import { IonTabs } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthenticateService } from '../services/authentication.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
  userEmail: string;

  constructor(
    private router: Router,
    private authService: AuthenticateService
  ) { }

  ngOnInit() { 
    this.authService.userDetails().subscribe(res => {
      console.log('res', res);
      if (res !== null) {
        this.userEmail = res.email;
      } else {
        this.router.navigate(['/login']);
      }
    }, err => {
      console.log('err', err);
    })
  }
  logout() {
    this.authService.logoutUser()
      .then(res => {
        console.log(res);
        this.router.navigate(['/login']);
      })
      .catch(error => {
        console.log(error);
      })

  }
}
  