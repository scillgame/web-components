import { Injectable } from '@angular/core';
import {BattlePass, BattlePassesApi, BattlePassLevel, getBattlePassApi, startMonitorBattlePassUpdates} from '@scillgame/scill-js';
import {SCILLService} from './scill.service';
import {BehaviorSubject, combineLatest, Observable, of, Subscription} from 'rxjs';
import {filter, map, mergeMap} from 'rxjs/operators';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';
import {UserBattlePassUpdateMonitor} from '@scillgame/scill-js/dist/user-battle-pass-update-monitor';
import {fromPromise} from 'rxjs/internal-compatibility';

export class SCILLBattlePassInfo {
  battlePass: BattlePass;
  levels: BattlePassLevel[] = [];
  currentLevel: number;
  levelStats: string;
  progress: number;
  levelProgress: number;
  monitorBattlePass: UserBattlePassUpdateMonitor;
  refresh$ = new BehaviorSubject<boolean>(false);
  accessToken: string;
  battlePassApi: BattlePassesApi;
}

@Injectable({
  providedIn: 'root'
})
export class SCILLBattlePassService {

  storage = new Map<string, BehaviorSubject<SCILLBattlePassInfo>>();
  subscriptions = new Subscription();

  constructor(private scillService: SCILLService) {

  }

  reloadBattlePass(battlePassId: string): void {
    if (!this.storage.has(battlePassId)) {
      return;
    }

    const battlePassInfo$ = this.storage.get(battlePassId);
    if (battlePassInfo$) {
      battlePassInfo$.getValue().refresh$.next(true);
    }
  }

  getBattlePassInfo(appId: string, battlePassId: string): Observable<SCILLBattlePassInfo> {
    if (this.storage.has(battlePassId)) {
      console.log("Getting cached battle pass info", appId, battlePassId);
      return this.storage.get(battlePassId).asObservable();
    } else {
      console.log("Loading battle pass info", appId, battlePassId);
      const battlePassInfo$ = new BehaviorSubject<SCILLBattlePassInfo>(null);
      this.storage.set(battlePassId, battlePassInfo$);

      this.scillService.accessToken$.pipe(
        filter(isNotNullOrUndefined),
        map(accessToken => {

          const battlePassInfo = new SCILLBattlePassInfo();
          battlePassInfo.monitorBattlePass = startMonitorBattlePassUpdates(accessToken, battlePassId, (payload => {
            battlePassInfo.refresh$.next(true);
          }));

          battlePassInfo.accessToken = accessToken;
          battlePassInfo.battlePassApi = getBattlePassApi(battlePassInfo.accessToken);

          return battlePassInfo;
        }),
        mergeMap(battlePassInfo => {
          return fromPromise(battlePassInfo.battlePassApi.getBattlePasses(appId, battlePassId)).pipe(
            map(battlePasses => {
                console.log(battlePasses);
                const foundBattlePass = battlePasses.filter(battlePass => battlePass.battle_pass_id === battlePassId)[0];
                battlePassInfo.battlePass = foundBattlePass;
                return battlePassInfo;
              }
            ));
        }),
        mergeMap(battlePassInfo => {
          return battlePassInfo.refresh$.pipe(
            mergeMap(refresh => {
              return fromPromise(battlePassInfo.battlePassApi.getBattlePassLevels(appId, battlePassId)).pipe(
                map(levels => {
                  battlePassInfo.levels = levels;
                  battlePassInfo.progress = 0;
                  for (const level of levels) {
                    let totalGoal = 0;
                    let totalCounter = 0;
                    for (const challenge of level.challenges) {
                      totalGoal += challenge.challenge_goal;
                      totalCounter += challenge.user_challenge_current_score;
                    }
                    const levelProgress = (totalGoal > 0) ? totalCounter / totalGoal : 0;
                    battlePassInfo.progress += levelProgress / levels.length;

                    if (level.activated_at !== null) {
                      battlePassInfo.currentLevel = level.level_priority;
                      battlePassInfo.levelProgress = levelProgress * 100;
                      battlePassInfo.levelStats = `${totalCounter} / ${totalGoal}`;
                    }
                  }
                  battlePassInfo.progress = Math.round(battlePassInfo.progress * 100);

                  return battlePassInfo;
                })
              );
            })
          );
        })
      ).subscribe(battlePassInfo$);

      return battlePassInfo$.asObservable();
    }
  }
}
