import {Component, ContentChild, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, TemplateRef} from '@angular/core';
import {
  BattlePass,
  BattlePassesApi, BattlePassLevel,
  Challenge,
  ChallengeCategory,
  ChallengesApi,
  ChallengeUpdateMonitor, getBattlePassApi, getChallengesApi, startMonitorBattlePassUpdates, startMonitorChallengeUpdates,
  UserBattlePassUpdateMonitor
} from '@scillgame/scill-js';
import {BehaviorSubject, combineLatest, Observable, of, Subscription} from 'rxjs';
import {filter, map, mergeMap} from 'rxjs/operators';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';
import {fromPromise} from 'rxjs/internal-compatibility';
import {SCILLBattlePassInfo, SCILLBattlePassService} from '../scillbattle-pass.service';
import {SCILLService} from '../scill.service';
import {SCILLPersonalChallengesInfo, SCILLPersonalChallengesService} from '../scillpersonal-challenges.service';

@Component({
  selector: 'scill-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss']
})
export class PopoverComponent implements OnInit, OnChanges {

  @Input('app-id') appId: string;
  @Input('user-id') userId: string;
  @Input('battle-pass-id') battlePassId: string;
  @Input('api-key') apiKey: string;
  @Input('access-token') accessToken: string;

  @Input('username') username: string;
  @Input('avatar-url') avatarUrl: string;
  @Input('progress-fill') progressFill: string;
  @Input('button-background') buttonBackground: string;

  battlePassInfo$: Observable<SCILLBattlePassInfo>;
  personalChallengesInfo$: Observable<SCILLPersonalChallengesInfo>;

  constructor(private scillService: SCILLService, private scillBattlePassService: SCILLBattlePassService, private scillPersonalChallengesService: SCILLPersonalChallengesService) {

  }

  ngOnInit(): void {
    this.battlePassInfo$ = this.scillBattlePassService.getBattlePassInfo(this.appId, this.battlePassId).pipe(
      map(battlePassInfo => {
        console.log(battlePassInfo);
        return battlePassInfo;
      })
    );

    this.personalChallengesInfo$ = this.scillPersonalChallengesService.getPersonalChallengesInfo(this.appId).pipe(
      map(personalChallengesInfo => {
        console.log(personalChallengesInfo);
        return personalChallengesInfo;
      })
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['accessToken'] && changes['accessToken'].currentValue) {
      console.log(changes['accessToken'].currentValue);
      this.scillService.setAccessToken(changes['accessToken'].currentValue);
    }
  }
}
