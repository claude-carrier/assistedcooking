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

  status = '';
  msg = '';
  favorites = [];
  groceryList = null;
  menuItem = null;

  constructor(private authService: AuthService, private iab: InAppBrowser) { }

  ngOnInit() {
    this.loadStartPageInfo();
  }

  loadStartPageInfo() {
    this.authService.getStartPageData().subscribe(res => {

      let rawdata =  JSON.stringify(res);
      // console.log('Raw Data: ', rawdata);

      let obj = JSON.parse(rawdata);
      //let obj = JSON.parse(JSON.parse(rawdata));
      // console.log(obj, typeof(obj));

      this.status = obj.STATUS;
      // console.log('Status: ', this.status);

      this.msg = obj.MSG;
      // console.log('Msg: ', this.msg);

      if (obj.FAVORITES.length > 0) {
        this.favorites = obj.FAVORITES;
      }
      // console.log('Favorites: ', this.favorites);

      if (obj.GROCERYLIST.gl_img) {
        this.groceryList = [obj.GROCERYLIST];
      }
      // console.log('Grocery List: ', this.groceryList);

      if (obj.MENUITEM.recipe_img) {
        this.menuItem = [obj.MENUITEM];
      }
      // console.log('Menu Item: ', this.menuItem);
    });
  }

  logout() {
    this.authService.logout();
  }

  openBlank(url) {
    this.iab.create(this.baseUrl + url, `_blank`, 'location=no,zoom=no');
  }
}
