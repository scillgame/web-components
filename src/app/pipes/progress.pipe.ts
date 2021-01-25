import { Pipe, PipeTransform } from '@angular/core';
import {Challenge} from '@scillgame/scill-js';

@Pipe({
  name: 'progress'
})
export class ProgressPipe implements PipeTransform {

  transform(value: Challenge, ...args: unknown[]): unknown {
    if (!value || !value.user_challenge_current_score || !value.challenge_goal) {
      return 0;
    }

    if (value.challenge_goal_condition === 0) {
      return (value.user_challenge_current_score / value.challenge_goal) * 100;
    } else {
      return (1.0 / (value.user_challenge_current_score / value.challenge_goal)) * 100;
    }
  }

}
