import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation}   from '@angular/core';
import {BattlePass, BattlePassLevel, BattlePassLevelChallenge, SCILLEnvironment} from '@scillgame/scill-js';
import {Observable}                                                              from 'rxjs';
import {map}                                                                     from 'rxjs/operators';
import {SCILLBattlePassInfo, SCILLBattlePassService}                             from '../scillbattle-pass.service';
import {SCILLService}                                                            from '../scill.service';

@Component({
  selector: 'scill-battle-pass',
  templateUrl: './battle-pass.component.html',
  styleUrls: ['./battle-pass.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BattlePassComponent implements OnInit, OnChanges {

  @Input('battle-pass-id') battlePassId: string;
  @Input('api-key') apiKey: string;
  @Input('app-id') appId: string;
  @Input('user-id') userId: string;
  @Input('access-token') accessToken: string;
  @Input('type-in-progress-color') typeInProgressColor: string;
  @Input('type-finished-color') typeFinishedColor: string;
  @Input('type-border-color') typeBorderColor: string;
  @Input('type-icon-color') typeIconColor: string;
  @Input('language') language: string;

  battlePassInfo$: Observable<SCILLBattlePassInfo>;

  constructor(private scillService: SCILLService, private scillBattlePassService: SCILLBattlePassService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.accessToken && changes.accessToken.currentValue) {
      this.scillService.setAccessToken(changes.accessToken.currentValue);
    }
  }

  ngOnInit(): void {
    if (!this.battlePassId){
      return;
    }

    this.battlePassInfo$ = this.scillBattlePassService.getBattlePassInfo(this.appId, this.battlePassId, this.language).pipe(
      map(battlePassInfo => {
        return battlePassInfo;
      })
    );
  }

  unlockBattlePass(battlePass: BattlePass): void {
    const battlePassApi = this.scillService.battlePassApi$.getValue();
    if (!battlePassApi) {
      return;
    }

    battlePassApi.unlockBattlePass(this.appId, battlePass.battle_pass_id).then(result => {
      if (result) {
        this.scillBattlePassService.reloadBattlePass(battlePass.battle_pass_id);
      }
    });
  }

  levelById(index: number, item: BattlePassLevel): any {
    return item.level_id;
  }

  challengeById(index: number, item: BattlePassLevelChallenge): any {
    return item.challenge_id;
  }

  unlockLevel(level: BattlePassLevel): void {
    const battlePassApi = this.scillService.battlePassApi$.getValue();
    if (!battlePassApi) {
      return;
    }

    battlePassApi.activateBattlePassLevel(this.appId, level.level_id, this.language).then(result => {
      if (result) {
        this.scillBattlePassService.reloadBattlePass(this.battlePassId);
      }
    });
  }

  claimLevelReward(level: BattlePassLevel): void {
    const battlePassApi = this.scillService.battlePassApi$.getValue();
    if (!battlePassApi) {
      return;
    }

    battlePassApi.claimBattlePassLevelReward(this.appId, level.level_id, this.language).then(result => {
      if (result) {
        this.scillBattlePassService.reloadBattlePass(this.battlePassId);
        // Let's unlock the next level
      }
    });
  }

  toggleSection(section: string): void {
    this[section] = !this[section];
  }

  calculateCompletedLevels(levels): number {
    let counter = 0;
    levels.map(lvl => {
      if (lvl.level_completed) {
        counter++;
      }
      return lvl;
    });
    return counter;
  }

  calculateCompletedChallenges(challenges): number {
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
