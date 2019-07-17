import { Component, OnInit } from '@angular/core';

import { AuthService } from 'src/app/services/auth.service';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
})
export class StartPage implements OnInit {
  baseUrl = environment.acBaseUrl;

  startPageData = '';
  status = '';
  msg = '';
  favorites = [];
  groceryList = '';
  menuItem = [];

  constructor(private authService: AuthService, private iab: InAppBrowser) { }

  ngOnInit() {
    this.loadStartPageInfo();
  }

  loadStartPageInfo() {
    this.authService.getStartPageData().subscribe(res => {

      let rawdata =  JSON.stringify(res);
      console.log(rawdata);

      let obj = JSON.parse(JSON.parse(rawdata));
      // let obj2 = JSON.parse(obj);
      console.log(obj, typeof(obj));
      // console.log(obj2, typeof(obj2));
      console.log(obj['GROCERYLIST']);
      console.log(obj.GROCERYLIST);

      // this.data = rawdata;
      this.startPageData = obj;
      this.status = obj.STATUS;
      this.msg = obj.MSG;
      this.favorites = obj.FAVORITES;
      this.groceryList = obj.GROCERYLIST;
      this.menuItem = obj.MENUITEM;
    });
  }

  logout() {
    this.authService.logout();
  }

  openBlank(url) {
    this.iab.create(this.baseUrl + url, `_blank`);
  }
}
