import {
  trigger,
  style,
  animate,
  transition,
  query,
  group
} from '@angular/animations';

export const pageChangeAnimation =
  trigger('routeAnimations', [
    transition('LoginPage <=> RegisterPage', [
      style({ position: 'relative' }),
      query(':enter', [
        style({
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%'
        }),
      ]),
      query(':leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%'
        }),
      ]),
      group([
        query(':leave', [
          animate('0.7s cubic-bezier(0.785, 0.135, 0.15, 0.86)', style({ left: '100%' }))
        ]),
        query(':enter', [
          animate('0.7s cubic-bezier(0.785, 0.135, 0.15, 0.86)', style({ left: '0%' }))
        ])
      ])
    ])
  ]);
