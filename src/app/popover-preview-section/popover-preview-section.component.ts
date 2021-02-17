import { Component, OnInit, Input }  from '@angular/core';
import {BattlePass}                  from '@scillgame/scill-js';
import {PersonalChallengesComponent} from '../personal-challenges/personal-challenges.component';


@Component({
  selector: 'scill-popover-preview-section',
  templateUrl: './popover-preview-section.component.html',
  styleUrls: ['./popover-preview-section.component.scss']
})
export class PopoverPreviewSectionComponent extends PersonalChallengesComponent{}
