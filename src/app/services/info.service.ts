import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class InfoService {
  constructor(
    private fireAuth: AngularFireAuth,
    private fdb: AngularFireDatabase,
    private router: Router,
    public toastController: ToastController
  ) {}

  getTempAmbiante() {
    return 15;
  }

  getTempChauffe() {
    return 40;
  }
  getQuantiteEau() {
    return 10;
  }
  getTempEauActuelle() {
    return 43;
  }

  faisibiliteReservation(after, before) {
    let reserve = false;
    this.fdb
      .object('/reservations/')
      .query.orderByChild('timestamp')
      .startAt(after)
      .endAt(before)
      .on('value', (snapchot) => {
        snapchot.forEach((snap) => {
          reserve = true;
          console.log('reserve a ', snap.val().timestamp);
        });
      });
    return reserve;
  }

  getMode() {
    return localStorage.getItem('mode');
  }

  deleteMode() {
    localStorage.removeItem('mode');
  }

  CalculDn(Qed, Td, mode) {
    let Dn;
    if (mode == 'economique') {
      switch (Td) {
        case 43:
          if (Qed == 10) {
            Dn = 60;
          } else if (Qed == 15) {
            Dn = 90;
          } else if (Qed == 20) {
            Dn = 100;
          }
          break;
        case 50:
          if (Qed == 10) {
            Dn = 40;
          } else if (Qed == 15) {
            Dn = 50;
          } else if (Qed == 20) {
            Dn = 60;
          }
          break;
        default:
      }
      console.log('Dn infoService', Dn);
      return Dn;
    }
  }

  startChauffage() {
    //  set valuer firebase == 10 , code electronique
    //  this is after confirm is clicked
  }

  async toast(message, position, color) {
    const toast = await this.toastController.create({
      message: message,
      position: position,
      color: color,
      duration: 2000,
    });
    toast.present();
  }

  dateAndTime() {
    var day;
    var dateNow = new Date();
    var dateNowS = dateNow
      .toString()
      .replace('GMT+0200', '')
      .replace('(heure d?????t?? d???Europe centrale)', '')
      .replace('(heure normale d???Europe centrale)', '');
    day =
      dateNowS.split(' ')[1] +
      ' ' +
      dateNowS.split(' ')[2] +
      ' ' +
      dateNowS.split(' ')[3];
    dateNowS = dateNowS.split(' ')[4];
    return { dateNowS, day };
  }

  dateAndTimeReservation(timestamp) {
    var day;
    var time = new Date(parseInt(timestamp));
    var timeS = time
      .toString()
      .replace('GMT+0200', '')
      .replace('(heure d?????t?? d???Europe centrale)', '')
      .replace('(heure normale d???Europe centrale)', '');
    day =
      timeS.split(' ')[1] +
      ' ' +
      timeS.split(' ')[2] +
      ' ' +
      timeS.split(' ')[3];
    timeS = timeS.split(' ')[4];
    return { timeS, day };
  }
}
