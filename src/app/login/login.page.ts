import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { UserService } from '../user.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  username: string = ""
  password: string = ""
  constructor(
    public auth: AngularFireAuth, 
    public user: UserService, 
    public router: Router) { }

  ngOnInit() {
  }

  goRegister(){
    this.router.navigate(['/register']);
  }

  async login() {
    const { username, password } = this
    try {
      const res = await this.auth.signInWithEmailAndPassword(username, password)

      if (res.user) {
        this.user.setUser({
          username,
          uid: res.user.uid
        })
        this.router.navigate(['/tabs'])
      }


    } catch(err){
      console.dir(err)
      if(err.code === "auth/user-not-found") {
        console.log("User not found")
      }
    }

  }

}