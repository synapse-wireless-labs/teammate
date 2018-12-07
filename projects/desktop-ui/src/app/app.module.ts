import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BLEConnectComponent } from './ble-connect.component';
import { WebBluetoothModule } from '@manekinekko/angular-web-bluetooth';
import { ExchangeOAuthComponent } from './components/exchange-oauth/exchange-oauth.component';
import { GithubOAuthComponent } from './components/github-oauth/github-oauth.component';
import { ImagePickerComponent } from './components/image-picker/image-picker.component';

@NgModule({
  declarations: [
    AppComponent,
    BLEConnectComponent,
    ExchangeOAuthComponent,
    GithubOAuthComponent,
    ImagePickerComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    WebBluetoothModule.forRoot({
      enableTracing: true, // or false, this will enable logs in the browser's console
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
