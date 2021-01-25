import { Pipe, PipeTransform } from '@angular/core';
import {Challenge} from '@scillgame/scill-js';

@Pipe({
  name: 'activeTill'
})
export class ActiveTillPipe implements PipeTransform {

  transform(value: Challenge, ...args: unknown[]): unknown {
    return new Date(value.user_challenge_activated_at).getTime() + value.challenge_duration_time * 60000;
  }

}
