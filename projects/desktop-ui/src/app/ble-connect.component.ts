import { Component, OnDestroy } from '@angular/core';
import { BluetoothService } from './bluetooth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'dui-ble-connect',
  template: `
      <div>
        Value from BLE: {{ value }}
        <button (click)="connect()">Connect to BLE</button>
      </div>
  `,
  styles: []
})
export class BLEConnectComponent implements OnDestroy {


  value: number = 0
  bsSub: Subscription = null
  
  constructor( private bs: BluetoothService ) {}
  
  connect() {
    this.bs.value().subscribe((value) => {
      this.value = value
    })
  }
  
  ngOnDestroy(): void {
    if (this.bsSub) {
      this.bsSub.unsubscribe()
    }
  }
}
