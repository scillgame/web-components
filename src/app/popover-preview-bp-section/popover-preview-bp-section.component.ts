import { Component, OnInit } from '@angular/core';
import {BattlePassComponent} from '../battle-pass/battle-pass.component';
import {faCaretLeft, faCaretDown} from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'scill-popover-preview-bp-section',
  templateUrl: './popover-preview-bp-section.component.html',
  styleUrls: ['./popover-preview-bp-section.component.scss']
})
export class PopoverPreviewBpSectionComponent extends BattlePassComponent{
    faCaretLeft = faCaretLeft;
    faCaretDown = faCaretDown;
}

