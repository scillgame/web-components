import {Component, Input, ViewEncapsulation} from '@angular/core';
import {BattlePassComponent}                 from '../battle-pass/battle-pass.component';

@Component({
  selector: 'scill-popover-preview-bp-section',
  templateUrl: './popover-preview-bp-section.component.html',
  styleUrls: ['./popover-preview-bp-section.component.scss'],
})
export class PopoverPreviewBpSectionComponent extends BattlePassComponent{
    // faCaretLeft = faCaretLeft;
    // faCaretDown = faCaretDown;
    @Input('type-in-progress-color') typeInProgressColor: string;
    @Input('type-finished-color') typeFinishedColor: string;
    @Input('type-border-color') typeBorderColor: string;
    @Input('type-icon-color') typeIconColor: string;
    @Input('battle-pass-title-color') battlePassTitleColor: string;
    @Input('battle-pass-lvl-progress-bar-background') battlePassLvlProgressBarBackground: string;
    @Input('battle-pass-lvl-progress-bar-fill-background') battlePassLvlProgressBarFillBackground: string;
    @Input('battle-pass-challenge-progress-background') battlePassChallengeProgressBackground: string;
    @Input('battle-pass-challenge-progress-fill-background') battlePassChallengeProgressFillBackground: string;
    @Input('battle-pass-challenge-background') battlePassChallengeBackground: string;
    @Input('battle-pass-in-progress-type-bg-color') battlePassInProgressTypeBgColor: string;
    @Input('battle-pass-finished-type-bg-color') battlePassFinishedTypeBgColor: string;
    @Input('battle-pass-type-border-color') battlePassTypeBorderColor: string;
    @Input('battle-pass-type-icon-color') battlePassTypeIconColor: string;
}

