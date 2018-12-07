import { Injectable } from '@angular/core';
import { IpcRenderer } from 'electron';

@Injectable({
  providedIn: 'root',
})
export class IpcService {
  ipcRenderer: IpcRenderer;

  isExchangeEnabled: boolean = false;

  constructor() {
    if (window.require) {
      try {
        this.ipcRenderer = window.require('electron').ipcRenderer;
      } catch (e) {
        throw e;
      }
    }
  }

  on(channel: string, listener: (event, arg) => void) {
    this.ipcRenderer.on(channel, listener);
  }
  send(channel: string, ...args) {
    this.ipcRenderer.send(channel, args);
  }
}
