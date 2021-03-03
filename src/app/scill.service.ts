import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {
  BattlePassesApi,
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

@Injectable({
  providedIn: 'root'
})
export class SCILLService {

  accessTokenStore = new Map<string, string>();

  accessToken$ = new BehaviorSubject<string>(null);
  battlePassApi$ = new BehaviorSubject<BattlePassesApi>(null);
  challengesApi$ = new BehaviorSubject<ChallengesApi>(null);

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
