import { animate, state, style, transition, trigger } from '@angular/animations';

export type viewportAnimationStates = 'void' | 'hideInterface' | 'showInterface';

export function viewportAnimation(triggerName: string) {
  return trigger(triggerName, [
    state('void, hideInterface', style({ transform: 'translateY(20vh)', opacity: 0 })),
    state('showInterface', style({ transform: 'translateY(0vh)' })),
    transition('* <=> *', [animate('350ms cubic-bezier(0.19, 1, 0.22, 1)')]),
  ]);
}
