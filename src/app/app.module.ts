import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HttpClientModule } from '@angular/common/http';
import { Storage, IonicStorageModule } from '@ionic/storage';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { environment } from 'src/environments/environment';

export function jwtOptionsFactory(storage: Storage) {
  return {
    tokenGetter: () => {
      // console.log('jwtOptionsFactory: ', storage.get('access_token').then((value) => value));
      return storage.get(environment.authTokenName).then((value) => value);
    },
    // whitelistedDomains: ['dev.AssistedCooking.com', 'client.AssistedCooking.com']
    whitelistedDomains: environment.whitelist
  };
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot(),
    HttpClientModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [Storage]
      }
    })
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    InAppBrowser,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
