import { Pipe, PipeTransform } from '@angular/core';
import {Challenge} from '@scillgame/scill-js';

@Pipe({
  name: 'completedChallenges'
})
export class CompletedChallengesPipe implements PipeTransform {

  transform(challenges: Challenge[], ...args: unknown[]): unknown {
    let counter = 0;
    if (challenges.length < 1) {
      return null;
    }
    challenges.map(ch => {
      if (ch.type === 'finished') {
        counter++;
      }
      return ch;
    });
    return counter;
  }

}
