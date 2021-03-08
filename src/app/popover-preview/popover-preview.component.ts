import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {Challenge, ChallengeCategory} from '@scillgame/scill-js';
import {buffer, debounceTime, map} from 'rxjs/operators';
import {SCILLNotification, SCILLService} from '../scill.service';
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
  @Input('avatar-url') avatarUrl: string;
  @Input('button-type') buttonType = "0";
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
  @Input('btn-progress') btnProgressColor: string;
  @Input('btn-level-color') btnLevelColor: string;
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
  @Input('main-font-family') mainFont = 'Helvetica, Sans-serif';
  @Input('notification-background') notificationBackground: string;
  @Input('notification-text-color') notificationTextColor: string;

  battlePassInfo$: Observable<SCILLBattlePassInfo>;
  personalChallengesInfo$: Observable<SCILLPersonalChallengesInfo>;
  isPopoverPreviewVisible = false;

  currentNotification$: Observable<SCILLNotification>;

  constructor(private scillService: SCILLService,
              private scillBattlePassService: SCILLBattlePassService,
              private scillPersonalChallengesService: SCILLPersonalChallengesService) {
  }

  ngOnInit(): void {
    if (this.battlePassId) {
      this.battlePassInfo$ = this.scillBattlePassService.getBattlePassInfo(this.appId, this.battlePassId).pipe(
        map(battlePassInfo => {
          console.log(battlePassInfo);
          return battlePassInfo;
        })
      );
    } else {
      this.battlePassInfo$ = of(null);
    }

    this.personalChallengesInfo$ = this.scillPersonalChallengesService.getPersonalChallengesInfo(this.appId).pipe(
      map(personalChallengesInfo => {
        console.log(personalChallengesInfo);
        return personalChallengesInfo;
      })
    );

    this.currentNotification$ = this.scillService.latestNotification$.asObservable().pipe(
      map(notification => {
        console.log(notification);
        return notification;
      })
    );
  }

  togglePopover(): void {
    this.scillService.clearNotifications();
    this.isPopoverPreviewVisible = !this.isPopoverPreviewVisible;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.accessToken && changes.accessToken.currentValue) {
      this.scillService.setAccessToken(changes.accessToken.currentValue);
    }
  }

  categoryById(index: number, category: ChallengeCategory): any {
    return category.category_id;
  }
}
