import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of, Subscription} from 'rxjs';
import {SCILLService} from './scill.service';
import {
  Challenge,
  ChallengeCategory,
  ChallengesApi,
  ChallengeWebhookPayload,
  getChallengesApi,
  getLeaderboardsApi,
  Leaderboard,
  LeaderboardMemberRanking,
  LeaderboardRanking,
  LeaderboardsApi, LeaderboardUpdateMonitor,
  LeaderboardUpdatePayload,
  SCILLEnvironment,
  startMonitorChallengeUpdates,
  startMonitorLeaderboardUpdates
} from '@scillgame/scill-js';
import {filter, map, mergeMap} from 'rxjs/operators';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';
import {SCILLPersonalChallengesInfo} from './scillpersonal-challenges.service';
import {ChallengeUpdateMonitor} from '@scillgame/scill-js/dist/challenge-update-monitor';

export class SCILLLeaderboardInfo {
  leaderboardName: string;
  numUserRakings: number;
  numTeamRankings: number;
  refresh$ = new BehaviorSubject<boolean>(false);
  accessToken: string;
  leaderboardsApi: LeaderboardsApi;
  userRankings: LeaderboardRanking[];
  teamRankings: LeaderboardRanking[];
  currentPage$ = new BehaviorSubject<number>(1);
  monitor: LeaderboardUpdateMonitor;
}

@Injectable({
  providedIn: 'root'
})
export class SCILLLeaderboardsService {

  storage = new Map<string, BehaviorSubject<SCILLLeaderboardInfo>>();
  subscriptions = new Subscription();

  constructor(private scillService: SCILLService) {
  }

  getLeaderboardInfo(leaderboardId, numItems = 25, language = 'en', environment?: SCILLEnvironment): Observable<SCILLLeaderboardInfo> {
    if (this.storage.has(leaderboardId)) {
      return this.storage.get(leaderboardId).asObservable();
    } else {
      const leaderboardInfo$ = new BehaviorSubject<SCILLLeaderboardInfo>(null);
      this.storage.set(leaderboardId, leaderboardInfo$);

      this.scillService.accessToken$.pipe(
        filter(isNotNullOrUndefined),
        map(accessToken => {

          const leaderboardInfo = new SCILLLeaderboardInfo();

          leaderboardInfo.monitor = startMonitorLeaderboardUpdates(accessToken, leaderboardId, (payload => {
            this.updateLeaderboard(leaderboardInfo$, payload);
          }), environment);

          leaderboardInfo.accessToken = accessToken;
          leaderboardInfo.leaderboardsApi = getLeaderboardsApi(leaderboardInfo.accessToken, environment);

          return leaderboardInfo;
        }),
        mergeMap(leaderboardInfo => {
          return leaderboardInfo.refresh$.pipe(
            mergeMap(refresh => {
              return leaderboardInfo.currentPage$.pipe(
                mergeMap(currentPage => {
                  if (currentPage >= 1) {
                    return leaderboardInfo.leaderboardsApi?.getLeaderboard(leaderboardId, currentPage, numItems, language).then(leaderboard => {
                      leaderboardInfo.leaderboardName = leaderboard.name;
                      leaderboardInfo.userRankings = leaderboard.grouped_by_users;
                      leaderboardInfo.teamRankings = leaderboard.grouped_by_teams;
                      leaderboardInfo.numUserRakings = 0; // is leaderboard.num_users once implemented in backend
                      leaderboardInfo.numTeamRankings = 0; // is leaderboard.num_teams once implemented in backend
                      return leaderboardInfo;
                    });
                  } else {
                    return of(leaderboardInfo);
                  }
                })
              );
            })
          );
        }),
        map(leaderboardInfo => {
          return leaderboardInfo;
        })
      ).subscribe(leaderboardInfo$);

      return leaderboardInfo$.asObservable();
    }
  }

  public updateLeaderboard(leaderboardInfo$: BehaviorSubject<SCILLLeaderboardInfo>, payload: LeaderboardUpdatePayload): void {
    const leaderboardInfo = leaderboardInfo$.getValue();
    leaderboardInfo.refresh$.next(true);
  }

  private nextPage(leaderboardInfo): void {

  }
}
