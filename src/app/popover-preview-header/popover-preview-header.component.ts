import {Component, Input} from '@angular/core';
import {BattlePassComponent}      from '../battle-pass/battle-pass.component';

@Component({
  selector: 'scill-popover-preview-header',
  templateUrl: './popover-preview-header.component.html',
  styleUrls: ['./popover-preview-header.component.scss']
})
export class PopoverPreviewHeaderComponent extends BattlePassComponent {
  @Input('api-key') apiKey: string;
  @Input('app-id') appId: string;
  @Input('user-id') userId: string;
  @Input('battle-pass-id') battlePassId: string;
  @Input('username') username: string;
  @Input('btn-background') btnBackground: string;
  @Input('header-background') headerBackground: string;
  @Input('header-notch-absolute-right') headerNotchAbsoluteRight: string;
  @Input('header-text-color') headerTextColor: string;
  @Input('header-bp-lvl-color') headerBpLvlColor: string;
  @Input('header-progress-bar-background') headerProgressBarBackground: string;
  @Input('header-progress-bar-fill-background') headerProgressBarFillBackground: string;
}
