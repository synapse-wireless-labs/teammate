import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'dui-github-oauth',
  template: `
    <section>
      <ng-template [ngIf]="!enabled">
        <div class="card">
          <span class="card-title">Github</span>
          <button (click)="onClicked()" class="card-button">Enable Github</button>
        </div>
      </ng-template>
      <ng-template [ngIf]="enabled">
        <div class="card" [class.active]="enabled">
          <span class="card-title">Github is enabled!</span>
        </div>
      </ng-template>
    </section>
  `,
})
export class GithubOAuthComponent {
  @Input() enabled: boolean;
  @Output() request = new EventEmitter<boolean>();

  onClicked() {
    this.request.emit(true);
  }
}
