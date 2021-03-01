import { Component, OnInit, Input }  from '@angular/core';
import {PersonalChallengesComponent} from '../personal-challenges/personal-challenges.component';

@Component({
  selector: 'scill-popover-preview-section',
  templateUrl: './popover-preview-section.component.html',
  styleUrls: ['./popover-preview-section.component.scss']
})
export class PopoverPreviewSectionComponent extends PersonalChallengesComponent{
    // faCaretDown = faCaretDown;
    // faCaretLeft = faCaretLeft;
    @Input() username: string;
    @Input('title') popoverPreviewSectionTitle: string;
    // this need to be Challenge interface but some props are not defined at Challenge interface @scillgame/scill-js SDK
    @Input('background') background: string;
    @Input('progress-fill') progressFill: string;
    @Input('progress-background') progressBackground: string;
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
}
