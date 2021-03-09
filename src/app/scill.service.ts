import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {
  BattlePassesApi, BattlePassLevel, BattlePassLevelChallenge, Challenge,
  ChallengesApi,
  getAuthApi,
  getBattlePassApi,
  getChallengesApi,
  startMonitorBattlePassUpdates
} from '@scillgame/scill-js';
import {fromPromise} from 'rxjs/internal-compatibility';
import {filter, map} from 'rxjs/operators';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';
import {SCILLBattlePassInfo} from './scillbattle-pass.service';

export class SCILLNotification {
  imageUrl?: string;
  message: string;
  action?: string;
  callback: () => void;
  checkmark: boolean;

  constructor(message: string, imageUrl: string, action?: string, callback?: () => void, checkmark?: boolean) {
    this.imageUrl = imageUrl;
    this.message = message;
    this.callback = callback;
    this.action = action;
    this.checkmark = checkmark;
  }
}

@Injectable({
  providedIn: 'root'
})
export class SCILLService {

  accessTokenStore = new Map<string, string>();

  accessToken$ = new BehaviorSubject<string>(null);
  battlePassApi$ = new BehaviorSubject<BattlePassesApi>(null);
  challengesApi$ = new BehaviorSubject<ChallengesApi>(null);

  latestNotification$ = new BehaviorSubject<SCILLNotification>(null);

  constructor() {
    // Setup Battle Pass Api
    this.accessToken$.pipe(
      filter(isNotNullOrUndefined),
      map(accessToken => {
        return getBattlePassApi(accessToken);
      })
    ).subscribe(this.battlePassApi$);

    // Setup Challenges Api
    this.accessToken$.pipe(
      filter(isNotNullOrUndefined),
      map(accessToken => {
        return getChallengesApi(accessToken);
      })
    ).subscribe(this.challengesApi$);
  }

  public clearNotifications(): void {
    this.latestNotification$.next(null);
  }

  public showNotification(message: string, imageUrl?: string, action?: string, buttonClicked?: () => void, duration?: number, checkmark?: boolean): void {
    this.latestNotification$.next(new SCILLNotification(message, imageUrl, action, buttonClicked, checkmark));
    setTimeout(() => {
      this.latestNotification$.next(null);
    }, duration ? duration : 50000);
  }

  public showChallengeCompleteNotification(challenge: Challenge): void {
    this.showNotification(challenge.challenge_name, challenge.challenge_icon, null, null, 5000, true);
  }

  public showBattlePassChallengeCompleteNotification(challenge: BattlePassLevelChallenge): void {
    this.showNotification(challenge.challenge_name, challenge.challenge_icon, null, null, 5000, true);
  }

  public showBattlePassLevelCompletedNotification(level: BattlePassLevel): void {
    this.showNotification("Congratulations, you are now on level " + level.level_priority + 1);
  }

  public setAccessToken(accessToken: string): void {
    if (this.accessToken$.getValue() !== accessToken) {
      this.accessToken$.next(accessToken);
    }
  }

  public getAccessToken(apiKey: string, userId: string): Observable<string> {
    if (!apiKey || !userId) {
      return of(null);
    }

    if (this.accessTokenStore.has(apiKey + userId)) {
      return of(this.accessTokenStore.get(apiKey + userId));
    }

    const authApi = getAuthApi(apiKey);
    return fromPromise(authApi.generateAccessToken({user_id: userId}).then(result => {
      this.accessTokenStore.set(apiKey + userId, result.token);
      return result.token;
    }));
  }
}
