import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewEncapsulation} from '@angular/core';
import {
  BattlePass,
  BattlePassesApi,
  BattlePassLevel,
  BattlePassLevelChallenge,
  getBattlePassApi,
  startMonitorBattlePassUpdates
} from '@scillgame/scill-js';
import {BehaviorSubject, combineLatest, Observable, of, Subscription} from 'rxjs';
import {combineAll, filter, map, mergeMap, withLatestFrom} from 'rxjs/operators';
import {UserBattlePassUpdateMonitor} from '@scillgame/scill-js/dist/user-battle-pass-update-monitor';
import {SCILLService} from '../scill.service';
import {fromPromise} from 'rxjs/internal-compatibility';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';

@Component({
  selector: 'scill-battle-pass',
  templateUrl: './battle-pass.component.html',
  styleUrls: ['./battle-pass.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BattlePassComponent implements OnInit, OnDestroy, OnChanges {

  @Input() battlePassId: string;
  @Input() accessToken: string;
  @Input() appId: string;

  accessToken$ = new BehaviorSubject<string>(null);
  battlePassApi$ = new BehaviorSubject<BattlePassesApi>(null);
  battlePass$ = new BehaviorSubject<BattlePass>(null);
  levels$: Observable<BattlePassLevel[]>;
  refresh$ = new BehaviorSubject<boolean>(false);
  levels: BattlePassLevel[] = [];

  monitorBattlePass: UserBattlePassUpdateMonitor;

  progress = 0;

  subscriptions = new Subscription();

  constructor() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['accessToken'] && changes['accessToken'].currentValue) {
      this.accessToken$.next(changes['accessToken'].currentValue);
    }
  }

  ngOnInit(): void {
    this.accessToken$.pipe(
      filter(isNotNullOrUndefined),
      map(accessToken => {
        if (this.monitorBattlePass) {
          this.monitorBattlePass.stop();
        }

        this.monitorBattlePass = startMonitorBattlePassUpdates(accessToken, this.battlePassId, (payload => {
          console.log("UPDATED BATTLE PASS", payload);
          this.refresh$.next(true);
        }));

        console.log("BATTLE PASS MONITOR", this.monitorBattlePass);

        return getBattlePassApi(accessToken);
      })
    ).subscribe(this.battlePassApi$);

    this.battlePassApi$.pipe(
      filter(isNotNullOrUndefined),
      mergeMap(battlePassApi => {
        return fromPromise(battlePassApi.getBattlePasses(this.appId, this.battlePassId)).pipe(
          map(battlePasses => {
            console.log(battlePasses);
            const foundBattlePass = battlePasses.filter(battlePass => battlePass.battle_pass_id === this.battlePassId)[0];
            console.log("FOUD", foundBattlePass);
            return foundBattlePass;
          }
        ));
      })
    ).subscribe(this.battlePass$);

    this.levels$ = combineLatest([this.battlePassApi$, this.refresh$]).pipe(
      mergeMap(([battlePassApi, refresh]) => {
        console.log(battlePassApi, refresh);
        if (battlePassApi) {
          return fromPromise(battlePassApi.getBattlePassLevels(this.appId, this.battlePassId));
        } else {
          return of([]);
        }
      })
    );

    // Update the total level progress counter
    this.subscriptions.add(this.levels$.subscribe(levels => {
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
    }));

    if (this.accessToken) {
      this.accessToken$.next(this.accessToken);
    }
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
    const battlePassApi = this.battlePassApi$.getValue();
    if (!battlePassApi) {
      return;
    }

    battlePassApi.activateBattlePassLevel(this.appId, level.level_id).then(result => {
      if (result) {
        this.refresh$.next(true);
      }
    });
  }

  claimLevelReward(level: BattlePassLevel): void {
    const battlePassApi = this.battlePassApi$.getValue();
    if (!battlePassApi) {
      return;
    }

    battlePassApi.claimBattlePassLevelReward(this.appId, level.level_id).then(result => {
      if (result) {
        this.refresh$.next(true);
        // Let's unlock the next level
      }
    });
  }
}
