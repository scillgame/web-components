import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {BattlePassStatusComponent} from '../battle-pass-status/battle-pass-status.component';

@Component({
  selector: 'scill-profile-button',
  templateUrl: './profile-button.component.html',
  styleUrls: ['./profile-button.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class ProfileButtonComponent extends BattlePassStatusComponent {
  @Input('username') username: string;
  @Input('avatar-url') avatarUrl: string;
  @Input('progress-fill') progressFill: string;
  @Input('button-background') buttonBackground: string;
}
