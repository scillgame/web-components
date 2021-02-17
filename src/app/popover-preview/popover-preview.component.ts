import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {PersonalChallengesComponent}                 from '../personal-challenges/personal-challenges.component';

@Component({
    selector   : 'scill-popover-preview',
    templateUrl: './popover-preview.component.html',
    styleUrls  : ['./popover-preview.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PopoverPreviewComponent extends PersonalChallengesComponent{

    // @Input('access-token') accessToken: string;
    // isPopoverPreviewVisible: boolean;
    // isBattlepassCollapsed: boolean = true;
    // isChallengesCollapsed: boolean;
    //
    // constructor() {
    // }
    //
    // ngOnInit(): void {
    //     console.log('%c THIS IS MY ACCESS TOKEN @PopoverPreview Component', 'color:gold;', this.accessToken);
    // }
    // togglePopoverPreview(): void {
    //     this.isPopoverPreviewVisible = !this.isPopoverPreviewVisible;
    // }
    // toggleSection(section: string): void {
    //     this[section] = !this[section];
    // }
}
