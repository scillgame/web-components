import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation} from '@angular/core';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {
  Challenge,
  ChallengeCategory,
  ChallengesApi,
  ChallengeUpdateMonitor,
  getChallengesApi,
  startMonitorChallengeUpdates
} from '@scillgame/scill-js';
import {filter, map} from 'rxjs/operators';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';
import {SCILLService} from '../scill.service';
import {PersonalChallengesComponent} from '../personal-challenges/personal-challenges.component';
import {SCILLBattlePassInfo, SCILLBattlePassService} from '../scillbattle-pass.service';
import {SCILLPersonalChallengesInfo, SCILLPersonalChallengesService} from '../scillpersonal-challenges.service';

@Component({
  selector: 'scill-popover-preview',
  templateUrl: './popover-preview.component.html',
  styleUrls: ['./popover-preview.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class PopoverPreviewComponent implements OnInit, OnChanges {
  @Input('api-key') apiKey: string;
  @Input('app-id') appId: string;
  @Input('user-id') userId: string;
  @Input('battle-pass-id') battlePassId: string;
  @Input('access-token') accessToken: string;
  @Input('challenge-id') challengeId: string;
  @Input('username') username: string;
  @Input('battle-pass-in-progress-type-bg-color') battlePassInProgressTypeBgColor: string;
  @Input('battle-pass-finished-type-bg-color') battlePassFinishedTypeBgColor: string;
  @Input('battle-pass-type-border-color') battlePassTypeBorderColor: string;
  @Input('battle-pass-type-icon-color') battlePassTypeIconColor: string;
  @Input('type-border-color') typeBorderColor: string;
  @Input('type-icon-color') typeIconColor: string;
  @Input('offset-top') offsetTop = 0;
  @Input('offset-right') offsetRight = 0;
  @Input('offset-bottom') offsetBottom = 0;
  @Input('offset-left') offsetLeft = 0;
  @Input('btn-background') btnBackground: string;
  @Input('header-background') headerBackground: string;
  @Input('header-notch-absolute-right') headerNotchAbsoluteRight: string;
  @Input('header-text-color') headerTextColor: string;
  @Input('header-bp-lvl-color') headerBpLvlColor: string;
  @Input('header-progress-bar-background') headerProgressBarBackground: string;
  @Input('header-progress-bar-fill-background') headerProgressBarFillBackground: string;
  @Input('battle-pass-title-color') battlePassTitleColor: string;
  @Input('battle-pass-lvl-progress-bar-background') battlePassLvlProgressBarBackground: string;
  @Input('battle-pass-lvl-progress-bar-fill-background') battlePassLvlProgressBarFillBackground: string;
  @Input('battle-pass-challenge-progress-background') battlePassChallengeProgressBackground: string;
  @Input('battle-pass-challenge-progress-fill-background') battlePassChallengeProgressFillBackground: string;
  @Input('battle-pass-challenge-background') battlePassChallengeBackground: string;
  @Input('personal-challenges-category-title-color') personalChallengesCategoryTitleColor: string;
  @Input('personal-challenges-category-progress-bar-background') personalChallengesCategoryProgressBarBackground: string;
  @Input('personal-challenges-category-progress-bar-fill-background') personalChallengesCategoryProgressBarFillBackground: string;
  @Input('personal-challenges-in-progress-type-bg-color') personalChallengesInProgressTypeBgColor: string;
  @Input('personal-challenges-finished-type-bg-color') personalChallengesFinishedTypeBgColor: string;
  @Input('personal-challenges-type-border-color') personalChallengesTypeBorderColor: string;
  @Input('personal-challenges-type-icon-color') personalChallengesTypeIconColor: string;
  @Input('personal-challenges-progress-background') personalChallengesProgressBackground: string;
  @Input('personal-challenges-progress-fill-background') personalChallengesProgressFillBackground: string;
  @Input('personal-challenges-background') personalChallengesBackground: string;
  @Input('button-background') buttonBackground: string;
  @Input('button-text-color') buttonTextColor: string;
  @Input('unlock-battle-pass-btn-background') unlockBattlePassBtnBackground: string;
  @Input('unlock-battle-pass-btn-text-color') unlockBattlePassBtnTextColor: string;

  battlePassInfo$: Observable<SCILLBattlePassInfo>;
  personalChallengesInfo$: Observable<SCILLPersonalChallengesInfo>;
  isPopoverPreviewVisible = true;

  constructor(private scillService: SCILLService,
              private scillBattlePassService: SCILLBattlePassService,
              private scillPersonalChallengesService: SCILLPersonalChallengesService) {
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
    if (changes.accessToken && changes.accessToken.currentValue) {
      console.log(changes.accessToken.currentValue);
      this.scillService.setAccessToken(changes.accessToken.currentValue);
    }
  }

  categoryById(index: number, category: ChallengeCategory) {
    return category.category_id;
  }
}
