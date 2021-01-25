import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';
import {getAuthApi} from '../../../../gaas/scill-javascript';
import {fromPromise} from 'rxjs/internal-compatibility';

@Injectable({
  providedIn: 'root'
})
export class SCILLService {

  accessTokenStore = new Map<string, string>();

  constructor() { }

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
