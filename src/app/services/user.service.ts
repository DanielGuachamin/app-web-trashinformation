import { Injectable } from '@angular/core';
import {Auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  getAuth} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private auth:Auth) { }

  user: any;
  authUser= getAuth();
  currentUser: any = this.authUser.currentUser;

  register (email:any, password:any){
    return new Promise((resolve, reject) => {
      createUserWithEmailAndPassword(this.auth, email, password)
          .then(userData => {
          resolve(userData)
        }).catch(err => console.log(reject(err)))
    });
  }

  login({email, password} : any){
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async logout(){
    try {
      await signOut(this.auth);
    } catch (error) {
      console.log(error);
    }
  }

  recoverPassword(email:string){
    return sendPasswordResetEmail(this.auth, email) 
      .then(() => {
        // Password reset email sent!
        // ..
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.log(errorCode);
        console.log(errorMessage)
      });
  }

  get getUser(){
    return this.currentUser;
  }

}