import { Component, OnInit, Input }  from '@angular/core';
import {BattlePass}                  from '@scillgame/scill-js';
import {PopoverPreviewComponent}     from '../popover-preview/popover-preview.component';


@Component({
  selector: 'scill-popover-preview-section',
  templateUrl: './popover-preview-section.component.html',
  styleUrls: ['./popover-preview-section.component.scss']
})
export class PopoverPreviewSectionComponent extends PopoverPreviewComponent{}
