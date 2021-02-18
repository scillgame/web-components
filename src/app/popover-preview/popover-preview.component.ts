import {Component, Input, OnInit, ViewEncapsulation, OnDestroy}                                                      from '@angular/core';
import {PersonalChallengesComponent}                                                                      from '../personal-challenges/personal-challenges.component';

@Component({
    selector   : 'scill-popover-preview',
    templateUrl: './popover-preview.component.html',
    styleUrls  : ['./popover-preview.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PopoverPreviewComponent extends PersonalChallengesComponent{}