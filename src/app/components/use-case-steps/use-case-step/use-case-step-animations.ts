import {
  animate,
  animateChild,
  query,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

const ease = {
  fastOutLinearIn: 'cubic-bezier(0.15, 0.0, 1, 1)',
};

export const stepAnimations = {
  state: trigger('state', [
    transition('* => *', [animate('0s {{delay}}ms ease', style({})), query('@*', animateChild())], {
      params: { delay: 0 },
    }),
  ]),

  trailProgress: trigger('trailProgress', [
    state(
      'void, active, inactive',
      style({
        transform: 'translateX(-100%)',
      }),
    ),
    state(
      'completed',
      style({
        transform: 'translateX(0)',
      }),
    ),

    transition('* => *', animate('550ms linear')),
  ]),

  icon: trigger('icon', [
    state('void, active, inactive', style({ transform: 'scale(0)' })),
    state('completed', style({ transform: 'scale(1)' })),

    transition(
      'completed => *',
      animate(`350ms 350ms ${ease.fastOutLinearIn}`, style({ transform: 'scale(0)' })),
    ),

    transition('* => completed', [
      animate(`250ms 250ms ${ease.fastOutLinearIn}`, style({ transform: 'scale(1.2)' })),
      animate(`150ms ${ease.fastOutLinearIn}`, style({ transform: 'scale(1)' })),
    ]),
  ]),

  indicator: trigger('indicator', [
    state(
      'inactive, void',
      style({
        borderWidth: '0px',
        borderColor: '#353c46',
        backgroundColor: '#e8e8e8',
      }),
    ),
    state(
      'active',
      style({
        borderWidth: '5px',
        borderColor: '#1c69d4',
        backgroundColor: '#fff',
      }),
    ),
    state(
      'completed',
      style({
        borderWidth: '18px',
        borderColor: '#353c46',
        backgroundColor: '#fff',
      }),
    ),

    transition('* => completed', animate(`350ms  ${ease.fastOutLinearIn}`)),

    transition('completed => *', animate(`300ms 550ms ${ease.fastOutLinearIn}`)),

    transition('void => active, inactive => active', animate(`150ms 50ms ${ease.fastOutLinearIn}`)),

    transition(
      'active => void, active => inactive',
      animate(`150ms 300ms ${ease.fastOutLinearIn}`),
    ),
  ]),
};
