import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BLEConnectComponent } from './ble-connect.component';
import { WebBluetoothModule } from '@manekinekko/angular-web-bluetooth';

@NgModule({
  declarations: [AppComponent, BLEConnectComponent, BrowserAnimationsModule],
  imports: [
    BrowserModule,
    WebBluetoothModule.forRoot({
      enableTracing: true, // or false, this will enable logs in the browser's console
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
