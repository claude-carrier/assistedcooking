import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

import { Storage } from '@ionic/storage';
import { Platform, AlertController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';

const TOKEN_KEY =  environment.authTokenName;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authState = new BehaviorSubject(false);
  url = environment.acAPIurl;    // found in /src/environments/environment.*.ts (both files)
  user = null;

  constructor(private  http: HttpClient, private helper: JwtHelperService, private  storage: Storage, private plt: Platform,
              private alertController: AlertController) {
    this.plt.ready().then(() => {
      this.checkToken();
    });
  }

  checkToken() {
    this.storage.get(TOKEN_KEY).then(token => {
      if (token) {
        let decoded = this.helper.decodeToken(token);
        let isExpired = this.helper.isTokenExpired(token);

          console.log('checkToken() decoded: ', decoded);
          console.log('checkToken() isExpired: ', isExpired);

        if (!isExpired) {
          this.user = decoded;
          this.authState.next(true);
        } else {
          this.storage.remove(TOKEN_KEY);
        }
      }
    });
  }

  login(credentials) {
    return this.http.post(`${this.url}?method=login`, credentials)
      .pipe(
        tap((token: string) => {
          // console.log('res: ', token);

          this.storage.set(TOKEN_KEY, token);

          let decoded = this.helper.decodeToken(token);
          let isExpired = this.helper.isTokenExpired(token);

          console.log('decoded: ', decoded);
          console.log('isExpired: ', isExpired);

          if (isExpired || decoded.authenticated === 'False') {
            this.showAlert('Warning', decoded.msg);
          } else {
            this.authState.next(true);
            this.user = decoded;
          }

        }),
        catchError(e => {
          console.log('e: ', e);

          this.showAlert('Error', e.error.msg);
          throw new Error(e);
        })
      );
  }

  logout() {
    this.storage.remove(TOKEN_KEY).then(() => {
      this.authState.next(false);
    });
  }

  isAuthenticated() {
    return this.authState.value;
  }

  showAlert(header, msg) {
    let alert = this.alertController.create({
      message: msg,
      header,
      buttons: ['OK']
    });
    alert.then(alert => alert.present());
  }

  getStartPageData() {
    return this.http.get(`${this.url}?method=getStartPageData`)
      .pipe(
        catchError(e => {
          const status = e.status;
          if (status === 401) {
            this.showAlert('Error', 'You are not authorized for this!');
            this.logout();
          }
          throw new Error(e);
        })
      );
    }
}

