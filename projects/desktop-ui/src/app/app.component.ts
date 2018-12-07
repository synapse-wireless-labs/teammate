import { Component } from '@angular/core';
import { GithubOAuthService } from './services/github-oauth.service';

@Component({
  selector: 'dui-root',
  template: `
    <h1>Configure your Teammate</h1>
    <dui-github-oauth
      [enabled]="githubAuthenticationService.isEnabled"
      (request)="onGithubClick()"
    ></dui-github-oauth>
    <dui-exchange-oauth
      [enabled]="isExchangeEnabled"
      (request)="onExchangeClick()"
    ></dui-exchange-oauth>
    <div class="card"><input type="file" /></div>
    <!-- Probably can be a simple file select -->
    <div class="card">
      <input type="checkbox" name="clock-enable" />
      <label for="clock-enable">Turn clocks off because clocks are bad</label>
    </div>
  `,
  styles: [``],
  animations: [],
  providers: [GithubOAuthService],
})
export class AppComponent {
  title = 'desktop-ui';

  isGithubEnabled: boolean = false;
  isExchangeEnabled: boolean = false;

  constructor(private githubAuthenticationService: GithubOAuthService) {}

  onGithubClick() {
    if (!this.githubAuthenticationService.isEnabled) {
      this.githubAuthenticationService.send();
    }
  }
  onExchangeClick() {
    //this.ipcRenderer.send('authenticate-exchange');
  }
}
