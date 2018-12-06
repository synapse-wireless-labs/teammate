import { Component, OnDestroy } from '@angular/core';

// @dpierce - test
import {
  persistentNotificationAnimation,
  persistentNotificationAnimationStates,
} from './animations/persistent-notification';
import {
  toastNotificationAnimation,
  toastNotificationAnimationStates,
} from './animations/toast-notification';
import { viewportAnimation, viewportAnimationStates } from './animations/viewport';
import {
  viewportOverlayAnimation,
  viewportOverlayAnimationStates,
} from './animations/viewport-overlay';
import { timer, Subscription } from 'rxjs';
// @dpierce - test

@Component({
  selector: 'dui-root',
  template: `
    <!-- The content below is only a placeholder and can be replaced. -->
    <div
      class="viewportOverlay"
      [@viewportOverlayTrigger]="viewportOverlayAnimState"
    ></div>
    <div [@viewportTrigger]="viewportAnimState">
      <div style="text-align:center">
        <h1>Welcome to {{ title }}!</h1>
        <img
          width="300"
          src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTAgMjUwIj4KICAgIDxwYXRoIGZpbGw9IiNERDAwMzEiIGQ9Ik0xMjUgMzBMMzEuOSA2My4ybDE0LjIgMTIzLjFMMTI1IDIzMGw3OC45LTQzLjcgMTQuMi0xMjMuMXoiIC8+CiAgICA8cGF0aCBmaWxsPSIjQzMwMDJGIiBkPSJNMTI1IDMwdjIyLjItLjFWMjMwbDc4LjktNDMuNyAxNC4yLTEyMy4xTDEyNSAzMHoiIC8+CiAgICA8cGF0aCAgZmlsbD0iI0ZGRkZGRiIgZD0iTTEyNSA1Mi4xTDY2LjggMTgyLjZoMjEuN2wxMS43LTI5LjJoNDkuNGwxMS43IDI5LjJIMTgzTDEyNSA1Mi4xem0xNyA4My4zaC0zNGwxNy00MC45IDE3IDQwLjl6IiAvPgogIDwvc3ZnPg=="
        />
      </div>
      <h2>Here are some links to help you start:</h2>
      <ul>
        <li>
          <h2>
            <a target="_blank" rel="noopener" href="https://angular.io/tutorial"
              >Tour of Heroes</a
            >
          </h2>
        </li>
        <li>
          <h2>
            <a target="_blank" rel="noopener" href="https://angular.io/cli"
              >CLI Documentation</a
            >
          </h2>
        </li>
        <li>
          <h2>
            <a target="_blank" rel="noopener" href="https://blog.angular.io/"
              >Angular blog</a
            >
          </h2>
        </li>
      </ul>

      <div>
        <h2>David's anim sandbox</h2>

        Persistent Notification Enter / Exit
        <!--
          <div class="testbox" [@notificationTrigger]="notificationAnimState">
            <span class="testcontent">Card Content Card Content Card Content</span>
          </div>
          <!--
            Toast Notification
            <div class="testbox" [@toastTrigger]="toastAnimState">
              <span class="testcontent">Card Content Card Content Card Content</span>
            </div>
        -->
      </div>
    </div>
    <dui-ble-connect></dui-ble-connect>
  `,
  styles: [
    `
      .testbox {
        display: block;
        margin-left: auto;
        margin-right: auto;
        width: 600px;
        height: 100px;
        background-color: rgb(144, 202, 249);
        border-radius: 5px;
      }

      .testcontent {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100%;
      }

      .testviewport {
        display: block;
        margin-left: auto;
        margin-right: auto;
        width: 300px;
        height: 300px;
        background-color: black;
        border-radius: 5px;
      }

      .viewportOverlay {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: black;
        z-index: 1;
      }
    `,
  ],
  animations: [
    persistentNotificationAnimation('notificationTrigger'),
    toastNotificationAnimation('toastTrigger'),
    viewportAnimation('viewportTrigger'),
    viewportOverlayAnimation('viewportOverlayTrigger'),
  ],
})
export class AppComponent implements OnDestroy {
  title = 'desktop-ui';

  // @dpierce - test
  sub: Subscription;
  notificationAnimState: persistentNotificationAnimationStates = 'hidden';
  toastAnimState: toastNotificationAnimationStates = 'hidden';
  viewportAnimState: viewportAnimationStates = 'showInterface';
  viewportOverlayAnimState: viewportOverlayAnimationStates = 'showInterface';

  constructor() {
    // Animation test timer.
    const source = timer(2500, 2500);
    this.sub = source.subscribe(() => {
      this.toggleNotificationAnimState();
      this.toggleToastAnimState();
      this.toggleViewportAnimState();
      this.toggleViewportOverlayAnimState();
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  toggleNotificationAnimState() {
    this.notificationAnimState =
      this.notificationAnimState === 'hidden' ? 'visible' : 'hidden';
  }

  toggleToastAnimState() {
    this.toastAnimState = this.toastAnimState === 'hidden' ? 'visible' : 'hidden';
  }

  toggleViewportAnimState() {
    this.viewportAnimState =
      this.viewportAnimState === 'hideInterface' ? 'showInterface' : 'hideInterface';
  }

  toggleViewportOverlayAnimState() {
    this.viewportOverlayAnimState =
      this.viewportOverlayAnimState === 'hideInterface'
        ? 'showInterface'
        : 'hideInterface';
  }
  // @dpierce - test
}
