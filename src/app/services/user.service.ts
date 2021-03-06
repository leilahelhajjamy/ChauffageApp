import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private fireAuth: AngularFireAuth,
    private fdb: AngularFireDatabase,
    private router: Router
  ) {}

  registerUser(username, passowrd) {
    var userData = {
      username: username,
      passowrd: passowrd,
    };
    this.fireAuth
      .createUserWithEmailAndPassword(username, passowrd)
      .then((userObj) => {
        console.log(userObj.user);
        this.fdb.list(`/users/${userObj.user.uid}`).push(userData);
        this.router.navigate(['']);
      })
      .catch((err) => {
        console.log('error when registering', err);
      });
  }

  saveConsommation(uid, timestamp, Wn, Qe) {
    let UtilisationDetails = {
      uid: uid,
      timestamp: timestamp,
      Wn: Wn,
      Qe: Qe,
    };
    let reservations = {
      uid: uid,
      timestamp: timestamp,
    };
    this.fdb.list(`/utilisations/`).push(UtilisationDetails);
    this.fdb.list(`/reservations/`).push(reservations);
  }
}
