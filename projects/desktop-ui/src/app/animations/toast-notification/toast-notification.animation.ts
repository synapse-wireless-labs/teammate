import {
  animate,
  state,
  style,
  transition,
  trigger,
  keyframes,
} from '@angular/animations';

export type toastNotificationAnimationStates = 'void' | 'hidden' | 'visible';

export function toastNotificationAnimation(triggerName: string) {
  return trigger(triggerName, [
    state(
      'void, hidden',
      style({ opacity: 0, transform: 'scale(0.98)', filter: 'blur(5px)' }),
    ),
    state('visible', style({ opacity: 1 })),
    transition(
      'hidden => visible',
      animate(
        `2200ms cubic-bezier(0.19, 1, 0.22, 1)`,
        keyframes([
          style({
            opacity: 0,
            transform: 'scale(0.98)',
            filter: 'blur(5px)',
            offset: 0.0,
          }),
          style({
            opacity: 1,
            transform: 'scale(1.03)',
            filter: 'blur(1px)',
            offset: 0.7,
          }),
          style({
            opacity: 1,
            transform: 'scale(1.01)',
            filter: 'blur(0px)',
            offset: 0.8,
          }),
          style({ opacity: 1, transform: 'scale(1.0)', offset: 1 }),
        ]),
      ),
    ),
    transition('visible => hidden', [animate(`600ms ease-in`)]),
  ]);
}
