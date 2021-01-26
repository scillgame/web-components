import {Component, Input, OnDestroy, OnInit} from '@angular/core';
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

@Component({
  selector: 'scill-battle-pass-status',
  templateUrl: './battle-pass-status.component.html',
  styleUrls: ['./battle-pass-status.component.scss']
})
export class BattlePassStatusComponent implements OnInit, OnDestroy {

  @Input() battlePassId: string;
  @Input() apiKey: string;
  @Input() appId: string;
  @Input() userId: string;

  levels: BattlePassLevel[] = [];
  battlePass: BattlePass;

  monitorBattlePass: UserBattlePassUpdateMonitor;

  progress = 0;

  subscriptions = new Subscription();

  battlePassApi: BattlePassesApi;

  constructor(private scillService: SCILLService) {

  }

  ngOnInit(): void {
    if (!this.apiKey || !this.userId || !this.battlePassId || !this.appId) {
      return;
    }

    this.subscriptions.add(this.scillService.getAccessToken(this.apiKey, this.userId).subscribe(accessToken => {
      this.battlePassApi = getBattlePassApi(accessToken);
      this.monitorBattlePass = startMonitorBattlePassUpdates(accessToken, this.battlePassId, (payload) => {
        this.loadBattlePassLevels();
      });
      this.loadBattlePassLevels();
    }));
  }

  loadBattlePassLevels(): void {
    this.battlePassApi.getBattlePassLevels(this.appId, this.battlePassId).then(levels => {
      this.levels = levels;

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
        console.log(levelProgress);
        this.progress += levelProgress / levels.length;
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
