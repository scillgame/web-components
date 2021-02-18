import { Component, OnInit, Input }  from '@angular/core';
import {BattlePass}                  from '@scillgame/scill-js';
import {PopoverPreviewComponent}     from '../popover-preview/popover-preview.component';
import { faCaretDown, faCaretLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'scill-popover-preview-section',
  templateUrl: './popover-preview-section.component.html',
  styleUrls: ['./popover-preview-section.component.scss']
})
export class PopoverPreviewSectionComponent extends PopoverPreviewComponent{
    faCaretDown = faCaretDown;
    faCaretLeft = faCaretLeft;
}
