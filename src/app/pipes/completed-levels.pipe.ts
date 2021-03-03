import { Pipe, PipeTransform } from '@angular/core';
import {BattlePassLevel} from '@scillgame/scill-js';

@Pipe({
  name: 'completedLevels'
})
export class CompletedLevelsPipe implements PipeTransform {

  transform(levels: BattlePassLevel[], ...args: unknown[]): unknown {
    let counter = 0;
    levels.map(lvl => {
      if (lvl.level_completed) {
        counter++;
      }
      return lvl;
    });
    return counter;
  }

}
