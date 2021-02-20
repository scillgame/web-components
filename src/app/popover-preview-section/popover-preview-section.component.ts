import { Component, OnInit, Input }  from '@angular/core';
import { faCaretDown, faCaretLeft }  from '@fortawesome/free-solid-svg-icons';
import {PersonalChallengesComponent} from '../personal-challenges/personal-challenges.component';

@Component({
  selector: 'scill-popover-preview-section',
  templateUrl: './popover-preview-section.component.html',
  styleUrls: ['./popover-preview-section.component.scss']
})
export class PopoverPreviewSectionComponent extends PersonalChallengesComponent{
    faCaretDown = faCaretDown;
    faCaretLeft = faCaretLeft;

}
