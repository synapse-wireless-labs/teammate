import {
  animate,
  state,
  style,
  transition,
  trigger,
  keyframes,
} from '@angular/animations';

export type persistentNotificationAnimationStates = 'void' | 'hidden' | 'visible';

export function persistentNotificationAnimation(triggerName: string) {
  return trigger(triggerName, [
    state('void, hidden', style({ opacity: 0 })),
    state('visible', style({ opacity: 1 })),
    transition(
      'hidden => visible',
      animate(
        `1800ms cubic-bezier(0.19, 1, 0.22, 1)`,
        keyframes([
          style({ opacity: 0, transform: 'translateX(-15px)', offset: 0.0 }),
          style({ opacity: 1, transform: 'translateX(5px)', offset: 0.75 }),
          style({ opacity: 1, transform: 'translateX(0px)', offset: 1 }),
        ]),
      ),
    ),
    transition('visible => hidden', [animate(`600ms ease-in`)]),
  ]);
}
