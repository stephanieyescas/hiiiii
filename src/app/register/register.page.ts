import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

import { AlertController } from '@ionic/angular'
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore'
import { UserService } from '../user.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  username: string = ""
  password: string = ""
  cpassword: string = ""

  constructor(
    public auth: AngularFireAuth,
    public alert: AlertController,
    public router: Router,
    public afstore: AngularFirestore,
    public user: UserService,
    public alertController: AlertController
  ) { }

  ngOnInit() {
  }
  goLogin (){
    this.router.navigate(['/login'])

  }

  async presntAlert(title: string, content: string) {
    const alert = await this.alertController.create({
      header: title,
      message: content,
      buttons: ['OK']
    })
  }

  async register() {
    const { username, password, cpassword } = this
    if (password !== cpassword) {
      this.showAlert("Error!", "Passwords don't match")
      return console.error("Passwords don't match")
    }

    try {
      const res = await this.auth.createUserWithEmailAndPassword(username, password);

      this.afstore.doc(`users/${res.user.uid}`).set({
        username
      })
      this.user.setUser({
        username,
        uid: res.user.uid
      })

      this.presntAlert('Success', 'You are registered!')
      this.router.navigate(['/tabs'])


      console.log(res)
      this.showAlert("Success!", "Welcome aboard!")
      this.router.navigate(['/tabs'])
    } catch (error) {
      console.dir(error)
      this.showAlert("Error", error.message)
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alert.create({
      header,
      message,
      buttons: ["Ok"]
    })

    await alert.present()
  }
}