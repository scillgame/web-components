import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation} from '@angular/core';
import {Observable} from 'rxjs';
import {SCILLPersonalChallengesInfo, SCILLPersonalChallengesService} from '../scillpersonal-challenges.service';
import {SCILLService} from '../scill.service';
import {ChallengesApi, LeaderboardRanking} from '@scillgame/scill-js';
import {map} from 'rxjs/operators';
import {SCILLLeaderboardInfo, SCILLLeaderboardsService} from '../scillleaderboards.service';

@Component({
  selector: 'scill-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LeaderboardComponent implements OnInit, OnChanges {

  @Input('app-id') appId: string;
  @Input('user-id') userId: string;
  @Input('leaderboard-id') leaderboardId: string;
  @Input('access-token') accessToken: string;
  @Input('language') language = 'en';
  @Input('page-size') pageSize = '25';
  @Input('member-type') memberType = 'user';
  @Input('avatar-url-prefix') avatarUrlPrefix = '';
  @Input('avatar-url-suffix') avatarUrlSuffix = '';
  @Input('avatar-images') showAvatarImages = 'false';
  @Input('pagination') pagination = 'true';

  leaderboardInfo$: Observable<SCILLLeaderboardInfo>;
  private page = 1;

  constructor(private scillService: SCILLService, protected scillLeaderboardService: SCILLLeaderboardsService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.accessToken && changes.accessToken.currentValue) {
      this.scillService.setAccessToken(changes.accessToken.currentValue);
    }
  }

  ngOnInit(): void {
    this.leaderboardInfo$ = this.scillLeaderboardService.getLeaderboardInfo(this.leaderboardId, parseInt(this.pageSize, 10), this.language).pipe(
      map(leaderboardInfo => {
        return leaderboardInfo;
      })
    );
  }

  rankingById(index: number, ranking: LeaderboardRanking): any {
    return `${ranking.member_type}_${ranking.member_id}`;
  }

  nextPage(leaderboardInfo: SCILLLeaderboardInfo): void {
    const currentPage = leaderboardInfo.currentPage$.getValue();

    // TODO: Add code to determing how many pages are available
    // The Leaderboard response will contain num_users and num_teams that can be used to calculate how many pages we have

    leaderboardInfo.currentPage$.next(currentPage + 1);
  }

  prevPage(leaderboardInfo: SCILLLeaderboardInfo): void {
    const currentPage = leaderboardInfo.currentPage$.getValue();
    console.log("HALLO", currentPage);
    if (currentPage > 1) {
      leaderboardInfo.currentPage$.next(currentPage - 1);
    }
  }
}
