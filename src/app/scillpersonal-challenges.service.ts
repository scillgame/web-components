import { Injectable } from '@angular/core';
import {ChallengeUpdateMonitor} from '@scillgame/scill-js/dist/challenge-update-monitor';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {
  Challenge,
  ChallengeCategory,
  ChallengesApi,
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
            this.updateChallenge(personalChallengesInfo, payload.new_challenge);
            personalChallengesInfo$.next(personalChallengesInfo);
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
        })
      ).subscribe(personalChallengesInfo$);

      return personalChallengesInfo$.asObservable();
    }
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
            this.updateChallenge(personalChallengesInfo, payload.new_challenge);
            personalChallengesInfo$.next(personalChallengesInfo);
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
        })
      ).subscribe(personalChallengesInfo$);

      return personalChallengesInfo$.asObservable();
    }
  }

  public updateChallenge(personalChallengesInfo: SCILLPersonalChallengesInfo, newChallenge: Challenge): void {
    if (personalChallengesInfo.challenge && personalChallengesInfo.challenge.challenge_id === newChallenge.challenge_id) {
      // We just have queried a single challenge before, so just update this one
      const updatedChallenge = {};
      Object.assign(updatedChallenge, personalChallengesInfo.challenge);
      Object.assign(updatedChallenge, newChallenge);
    } else {
      // We have queried categories before, find the updated challenge and update it with the new data
      for (const category of personalChallengesInfo.categories) {
        for (let i = 0; i < category.challenges.length; i++) {
          if (category.challenges[i].challenge_id === newChallenge.challenge_id) {
            // Create a copy of the original challenge and overwrite with new challenge
            const updatedChallenge = {};
            Object.assign(updatedChallenge, category.challenges[i]);
            Object.assign(updatedChallenge, newChallenge);
            category.challenges.splice(i, 1, updatedChallenge);
            break;
          }
        }
      }
    }
  }
}
