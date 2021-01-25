import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {getAuthApi} from '../../../../gaas/scill-javascript';
import {fromPromise} from 'rxjs/internal-compatibility';

@Injectable({
  providedIn: 'root'
})
export class SCILLService {

  constructor() { }

  public getAccessToken(apiKey: string, userId: string): Observable<string> {
    const authApi = getAuthApi(apiKey);
    return fromPromise(authApi.generateAccessToken({user_id: userId}).then(result => {
      return result.token;
    }));
  }
}
