import {Component, Input, ViewEncapsulation}                                           from '@angular/core';
import {BehaviorSubject, Subscription}                                                                    from 'rxjs';
import {
    Challenge,
    ChallengeCategory,
    ChallengesApi,
    ChallengeUpdateMonitor,
    getChallengesApi,
    startMonitorChallengeUpdates
}                                    from '@scillgame/scill-js';
import {filter, map}                 from 'rxjs/operators';
import {isNotNullOrUndefined}        from 'codelyzer/util/isNotNullOrUndefined';
import {SCILLService}                from '../scill.service';
import {PersonalChallengesComponent} from '../personal-challenges/personal-challenges.component';

@Component({
    selector     : 'scill-popover-preview',
    templateUrl  : './popover-preview.component.html',
    styleUrls    : ['./popover-preview.component.scss'],
    encapsulation: ViewEncapsulation.ShadowDom
})
export class PopoverPreviewComponent extends PersonalChallengesComponent{
    @Input('api-key') apiKey: string;
    @Input('app-id') appId: string;
    @Input('user-id') userId: string;
    @Input('battle-pass-id') battlePassId: string;
    @Input('access-token') accessToken: string;
    @Input('challenge-id') challengeId: string;
    @Input('username') username: string;
    @Input() category: ChallengeCategory;
    isPopoverPreviewVisible: boolean = true;
    challengeMonitor: ChallengeUpdateMonitor;
    challengesApi$ = new BehaviorSubject<ChallengesApi>(null);
    accessToken$ = new BehaviorSubject<string>(null);
    subscriptions: Subscription = new Subscription();
    categories: ChallengeCategory[] = [];
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


}
