import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'dui-exchange-oauth',
  template: `
    <section>
      <ng-template [ngIf]="!enabled">
        <div class="card">
          <span class="card-title">Exchange</span>
          <button (click)="onClicked()" class="card-button" disabled="disabled">
            Enable Exchange
          </button>
        </div>
      </ng-template>
      <ng-template [ngIf]="enabled">
        <div class="card"><span class="card-title">Exchange is enabled!</span></div>
      </ng-template>
    </section>
  `,
})
export class ExchangeOAuthComponent {
  @Input() enabled: boolean;
  @Output() request = new EventEmitter<boolean>();

  onClicked() {
    this.request.emit(true);
  }
}
