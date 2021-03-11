import { Injectable } from '@angular/core';
import {ChallengeUpdateMonitor} from '@scillgame/scill-js/dist/challenge-update-monitor';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {
  Challenge,
  ChallengeCategory,
  ChallengesApi, ChallengeWebhookPayload,
  getChallengesApi,
  startMonitorChallengeUpdates
} from '@scillgame/scill-js';
import {SCILLBattlePassInfo} from './scillbattle-pass.service';
import {filter, map, mergeMap} from 'rxjs/operators';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';
import {SCILLService} from './scill.service';

export class SCILLPersonalChallengesInfo {
  categories?: ChallengeCategory[] = [];
  challenge?: Challenge;
  monitor: ChallengeUpdateMonitor;
  refresh$ = new BehaviorSubject<boolean>(false);
  accessToken: string;
  challengesApi: ChallengesApi;
  progress: number;
  stats: string;
}

@Injectable({
  providedIn: 'root'
})
export class SCILLPersonalChallengesService {
  storage = new Map<string, BehaviorSubject<SCILLPersonalChallengesInfo>>();
  subscriptions = new Subscription();

  constructor(private scillService: SCILLService) { }

  getPersonalChallengesInfo(appId): Observable<SCILLPersonalChallengesInfo> {
    if (this.storage.has(appId)) {
      return this.storage.get(appId).asObservable();
    } else {
      const personalChallengesInfo$ = new BehaviorSubject<SCILLPersonalChallengesInfo>(null);
      this.storage.set(appId, personalChallengesInfo$);

      this.scillService.accessToken$.pipe(
        filter(isNotNullOrUndefined),
        map(accessToken => {

          const personalChallengesInfo = new SCILLPersonalChallengesInfo();
          personalChallengesInfo.monitor = startMonitorChallengeUpdates(accessToken, (payload => {
            this.updateChallenge(personalChallengesInfo$, payload);
            personalChallengesInfo$.next(this.calculateStats(personalChallengesInfo));
          }));

          personalChallengesInfo.accessToken = accessToken;
          personalChallengesInfo.challengesApi = getChallengesApi(personalChallengesInfo.accessToken);

          return personalChallengesInfo;
        }),
        mergeMap(personalChallengesInfo => {
          return personalChallengesInfo.challengesApi?.getAllPersonalChallenges(appId).then(categories => {
            personalChallengesInfo.categories = categories;
            return personalChallengesInfo;
          });
        }),
        map(personalChallengesInfo => {
          return this.calculateStats(personalChallengesInfo);
        })
      ).subscribe(personalChallengesInfo$);

      return personalChallengesInfo$.asObservable();
    }
  }

  private calculateStats(personalChallengesInfo: SCILLPersonalChallengesInfo): SCILLPersonalChallengesInfo {
    if (personalChallengesInfo.categories) {
      let totalCounter = 0;
      let totalGoals = 0;
      for (const category of personalChallengesInfo.categories) {
        for (const challenge of category.challenges) {
          totalCounter += challenge.user_challenge_current_score;
          totalGoals += challenge.challenge_goal;
        }
      }
      personalChallengesInfo.progress = Math.round((totalCounter / totalGoals) * 100);
      personalChallengesInfo.stats = `${totalCounter} / ${totalGoals}`;
    } else if (personalChallengesInfo.challenge) {
      personalChallengesInfo.progress = Math.round(personalChallengesInfo.challenge.user_challenge_current_score / personalChallengesInfo.challenge.challenge_goal) * 100;
      personalChallengesInfo.stats = `${personalChallengesInfo.challenge.user_challenge_current_score} / ${personalChallengesInfo.challenge.challenge_goal}`;
    }
    return personalChallengesInfo;
  }

  getPersonalChallengeInfo(appId, challengeId): Observable<SCILLPersonalChallengesInfo> {
    const key = `${appId}_${challengeId}`;
    if (this.storage.has(key)) {
      return this.storage.get(key).asObservable();
    } else {
      const personalChallengesInfo$ = new BehaviorSubject<SCILLPersonalChallengesInfo>(null);
      this.storage.set(key, personalChallengesInfo$);

      this.scillService.accessToken$.pipe(
        filter(isNotNullOrUndefined),
        map(accessToken => {
          const personalChallengesInfo = new SCILLPersonalChallengesInfo();
          personalChallengesInfo.monitor = startMonitorChallengeUpdates(accessToken, (payload => {
            this.updateChallenge(personalChallengesInfo$, payload);
          }));

          personalChallengesInfo.accessToken = accessToken;
          personalChallengesInfo.challengesApi = getChallengesApi(personalChallengesInfo.accessToken);

          return personalChallengesInfo;
        }),
        mergeMap(personalChallengesInfo => {
          return personalChallengesInfo.challengesApi?.getPersonalChallengeById(appId, challengeId).then(challenge => {
            personalChallengesInfo.challenge = challenge;
            return personalChallengesInfo;
          });
        }),
        map(personalChallengesInfo => {
          return this.calculateStats(personalChallengesInfo);
        })
      ).subscribe(personalChallengesInfo$);

      return personalChallengesInfo$.asObservable();
    }
  }

  public updateChallenge(personalChallengesInfo$: BehaviorSubject<SCILLPersonalChallengesInfo>, payload: ChallengeWebhookPayload): void {
    const personalChallengesInfo = personalChallengesInfo$.getValue();
    if (personalChallengesInfo.challenge && personalChallengesInfo.challenge.challenge_id === payload.new_challenge.challenge_id) {
      // We just have queried a single challenge before, so just update this one
      Object.assign(personalChallengesInfo.challenge, payload.new_challenge);

      if (payload.old_challenge.type === 'in-progress' && payload.new_challenge.type === 'unclaimed') {
        this.scillService.showNotification(personalChallengesInfo.challenge.challenge_name, personalChallengesInfo.challenge.challenge_icon);
      }
      personalChallengesInfo$.next(this.calculateStats(personalChallengesInfo));
    } else {
      // We have queried categories before, find the updated challenge and update it with the new data
      for (const category of personalChallengesInfo.categories) {
        for (let i = 0; i < category.challenges.length; i++) {
          if (category.challenges[i].challenge_id === payload.new_challenge.challenge_id) {
            // Create a copy of the original challenge and overwrite with new challenge
            const updatedChallenge: Challenge = {};
            Object.assign(updatedChallenge, category.challenges[i]);
            Object.assign(updatedChallenge, payload.new_challenge);
            category.challenges.splice(i, 1, updatedChallenge);

            if (payload.old_challenge.type === 'in-progress' && payload.new_challenge.type === 'unclaimed') {
              this.scillService.showNotification(updatedChallenge.challenge_name, updatedChallenge.challenge_icon);
            }
            personalChallengesInfo$.next(this.calculateStats(personalChallengesInfo));
            break;
          }
        }
      }
    }
  }
}
