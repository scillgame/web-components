import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {
  BattlePassesApi, BattlePassLevel, BattlePassLevelChallenge, Challenge,
  ChallengesApi, EventMetaData, EventsApi,
  getAuthApi,
  getBattlePassApi,
  SCILLEnvironment,
  getChallengesApi,
  getEventsApi,
  startMonitorBattlePassUpdates, LeaderboardsApi, getLeaderboardsApi
} from '@scillgame/scill-js';
import {fromPromise} from 'rxjs/internal-compatibility';
import {catchError, filter, map} from 'rxjs/operators';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';
import {SCILLBattlePassInfo} from './scillbattle-pass.service';

export class SCILLNotification {
  imageUrl?: string;
  message: string;
  action?: string;
  callback: () => void;
  checkmark: boolean;
  challenge?: Challenge;

  constructor(message: string, imageUrl: string, action?: string, callback?: () => void, checkmark?: boolean, challenge?: Challenge) {
    this.imageUrl = imageUrl;
    this.message = message;
    this.callback = callback;
    this.action = action;
    this.checkmark = checkmark;
    this.challenge = challenge;
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
  eventsApi$ = new BehaviorSubject<EventsApi>(null);
  leaderboardsApi$ = new BehaviorSubject<LeaderboardsApi>(null);

  latestNotification$ = new BehaviorSubject<SCILLNotification>(null);

  public get environment(): SCILLEnvironment {
    return window['SCILLEnvironment'] ? window['SCILLEnvironment'] as SCILLEnvironment : 'production' as SCILLEnvironment;
  }

  constructor() {
    // Setup Battle Pass Api
    this.accessToken$.pipe(
      filter(isNotNullOrUndefined),
      map(accessToken => {
        return getBattlePassApi(accessToken, this.environment);
      })
    ).subscribe(this.battlePassApi$);

    // Setup Challenges Api
    this.accessToken$.pipe(
      filter(isNotNullOrUndefined),
      map(accessToken => {
        return getChallengesApi(accessToken, this.environment);
      })
    ).subscribe(this.challengesApi$);

    this.accessToken$.pipe(
      filter(isNotNullOrUndefined),
      map(accessToken => {
        return getEventsApi(accessToken, this.environment);
      })
    ).subscribe(this.eventsApi$);

    this.accessToken$.pipe(
      filter(isNotNullOrUndefined),
      map(accessToken => {
        return getLeaderboardsApi(accessToken, this.environment);
      })
    ).subscribe(this.leaderboardsApi$);
  }

  public get eventsApi(): EventsApi {
    return this.eventsApi$.getValue();
  }

  public get challengesApi(): ChallengesApi {
    return this.challengesApi$.getValue();
  }

  public get battlePassesApi(): BattlePassesApi {
    return this.battlePassApi$.getValue();
  }

  public get leaderboardsApi(): LeaderboardsApi {
    return this.leaderboardsApi$.getValue();
  }

  public clearNotifications(): void {
    this.latestNotification$.next(null);
  }

  public showNotification(message: string, imageUrl?: string, action?: string, buttonClicked?: () => void, duration?: number, checkmark?: boolean): void {
    this.latestNotification$.next(new SCILLNotification(message, imageUrl, action, buttonClicked, checkmark));
    setTimeout(() => {
      this.latestNotification$.next(null);
    }, duration ? duration : 5000);
  }

  public showProgressNotification(message: string, challenge: Challenge, action?: string, buttonClicked?: () => void, duration?: number, checkmark?: boolean): void {
    this.latestNotification$.next(new SCILLNotification(message, challenge.challenge_icon, action, buttonClicked, checkmark, challenge));
    setTimeout(() => {
      this.latestNotification$.next(null);
    }, duration ? duration : 5000);
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

  public sendEvent(eventName: string, sessionId: string, userId: string, metaData: EventMetaData = {}): Observable<boolean> {
    return fromPromise(this.eventsApi?.sendEvent({
      event_name: eventName,
      event_type: 'single',
      session_id: sessionId,
      user_id: userId,
      meta_data: metaData
    })).pipe(
      map(response => {
        if (response && response.status >= 200 && response.status < 300) {
          return true;
        } else {
          return false;
        }
      }),
      catchError(error => {
        return of(false);
      })
    );
  }

  public sendGroupEvent(eventName: string, sessionId: string, userId: string, metaData: EventMetaData = {}): Observable<boolean> {
    return fromPromise(this.eventsApi?.sendEvent({
      event_name: eventName,
      event_type: 'group',
      session_id: sessionId,
      user_id: userId,
      meta_data: metaData
    })).pipe(
      map(response => {
        if (response && response.status >= 200 && response.status < 300) {
          return true;
        } else {
          return false;
        }
      }),
      catchError(error => {
        return of(false);
      })
    );
  }
}
