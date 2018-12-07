import { Injectable } from '@angular/core';
import { IpcService } from './ipc.service';

@Injectable({
  providedIn: 'root',
})
export class GithubOAuthService {
  isEnabled = false;
  isSent = false;

  constructor(private ipcService: IpcService) {
    this.ipcService.on('authenticate-github', (_, arg) => {
      console.log('authenticated w/ Github!');
      console.log(_);
      console.log(arg);
      this.isEnabled = arg || false;
      this.isSent = false;
    });
  }
  send() {
    console.log('trying to authenticate...');
    this.ipcService.send('authenticate-github');
    this.isSent = true;
  }
}
