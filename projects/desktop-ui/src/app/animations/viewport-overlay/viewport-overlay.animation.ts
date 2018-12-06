import { animate, state, style, transition, trigger } from '@angular/animations';

export type viewportOverlayAnimationStates = 'void' | 'hideInterface' | 'showInterface';

export function viewportOverlayAnimation(triggerName: string) {
  return trigger(triggerName, [
    state('void', style({ opacity: 0 })),
    state('showInterface', style({ opacity: 0 })),
    state('hideInterface', style({ opacity: 1 })),
    transition('* <=> *', [animate('450ms cubic-bezier(0.19, 1, 0.22, 1)')]),
  ]);
}
