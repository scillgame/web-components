import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {PersonalChallengesComponent}                 from '../personal-challenges/personal-challenges.component';

@Component({
    selector   : 'scill-popover-preview',
    templateUrl: './popover-preview.component.html',
    styleUrls  : ['./popover-preview.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PopoverPreviewComponent implements OnInit{

    @Input('access-token') accessToken: string;
    @Input('title') popoverPreviewSectionTitle: string;
    isPopoverPreviewVisible: boolean = true;
    isBattlepassExpanded: boolean = true;
    isChallengesExpanded: boolean;
    isCollapsed: boolean = true;
    constructor() {
    }

    ngOnInit(): void {
        console.log('%c THIS IS MY ACCESS TOKEN @PopoverPreview Component', 'color:gold;', this.accessToken);
    }
    toggleSection(section: string): void {
        this[section] = !this[section];
    }
}
