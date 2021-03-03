import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {BattlePassStatusComponent} from '../battle-pass-status/battle-pass-status.component';
import {SCILLBattlePassInfo} from '../scillbattle-pass.service';

@Component({
  selector: 'scill-profile-button',
  templateUrl: './profile-button.component.html',
  styleUrls: ['./profile-button.component.scss']
})
export class ProfileButtonComponent {
  @Input('username') username: string;
  @Input('avatar-url') avatarUrl: string;
  @Input('progress-fill') progressFill: string;
  @Input('button-background') buttonBackground: string;
  @Input() progress: number;
  @Input() stats: string;
  @Input() level: number;
}
