import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {BattlePassComponent} from '../battle-pass/battle-pass.component';
import {SCILLService} from '../scill.service';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {
  BattlePass,
  BattlePassesApi,
  BattlePassLevel, BattlePassLevelChallenge,
  getBattlePassApi, startMonitorBattlePassUpdates,
  UserBattlePassUpdateMonitor
} from '@scillgame/scill-js';
import {filter, map} from 'rxjs/operators';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';

@Component({
  selector: 'scill-battle-pass-status',
  templateUrl: './battle-pass-status.component.html',
  styleUrls: ['./battle-pass-status.component.scss']
})
export class BattlePassStatusComponent implements OnDestroy, OnChanges {

  @Input('battle-pass-id') battlePassId: string;
  @Input('api-key') apiKey: string;
  @Input('app-id') appId: string;
  @Input('user-id') userId: string;
  @Input('access-token') accessToken: string;

  accessToken$ = new BehaviorSubject<string>(null);
  levels: BattlePassLevel[] = [];
  battlePass: BattlePass;
  monitorBattlePass: UserBattlePassUpdateMonitor;
  progress = 0;
  levelProgress = 0;
  levelStats = '';
  currentLevel = 1;
  subscriptions = new Subscription();
  battlePassApi: BattlePassesApi;

  constructor() {
    this.subscriptions.add(this.accessToken$.pipe(
      filter(isNotNullOrUndefined)
      ).subscribe(accessToken => {
        this.battlePassApi = getBattlePassApi(accessToken);
        this.monitorBattlePass = startMonitorBattlePassUpdates(accessToken, this.battlePassId, (payload) => {
          this.loadBattlePassLevels();
        });
        this.loadBattlePassLevels();
      })
    );

    if (this.accessToken) {
      this.accessToken$.next(this.accessToken);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['accessToken'] && changes['accessToken'].currentValue) {
      this.accessToken$.next(changes['accessToken'].currentValue);
      console.log("BATTLE PASS", changes['accessToken'].currentValue);
    }
  }

  loadBattlePassLevels(): void {
    this.battlePassApi.getBattlePassLevels(this.appId, this.battlePassId).then(levels => {
      this.levels = levels;
      this.progress = 0;
      for (const level of levels) {
        let totalGoal = 0;
        let totalCounter = 0;
        for (const challenge of level.challenges) {
          totalGoal += challenge.challenge_goal;
          totalCounter += challenge.user_challenge_current_score;
        }
        const levelProgress = (totalGoal > 0) ? totalCounter / totalGoal : 0;
        this.progress += levelProgress / levels.length;

        if (level.activated_at !== null) {
          this.currentLevel = level.level_priority;
          this.levelProgress = levelProgress * 100;
          this.levelStats = `${totalCounter} / ${totalGoal}`;
        }
      }
      this.progress *= 100;
    });
  }

  ngOnDestroy(): void {
    if (this.monitorBattlePass) {
      this.monitorBattlePass.stop();
      this.monitorBattlePass = null;
    }
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }

  levelById(index: number, item: BattlePassLevel): any {
    return item.level_id;
  }

  challengeById(index: number, item: BattlePassLevelChallenge): any {
    return item.challenge_id;
  }

  unlockLevel(level: BattlePassLevel): void {
    if (!this.battlePassApi) {
      return;
    }

    this.battlePassApi.activateBattlePassLevel(this.appId, level.level_id).then(result => {
      if (result) {
        this.loadBattlePassLevels();
      }
    });
  }

  claimLevelReward(level: BattlePassLevel): void {
    if (!this.battlePassApi) {
      return;
    }

    this.battlePassApi.claimBattlePassLevelReward(this.appId, level.level_id).then(result => {
      if (result) {
        this.loadBattlePassLevels();
      }
    });
  }

}
