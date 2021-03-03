import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {BattlePassComponent} from '../battle-pass/battle-pass.component';
import {SCILLService} from '../scill.service';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {
  BattlePass,
  BattlePassesApi,
  BattlePassLevel, BattlePassLevelChallenge,
  getBattlePassApi, startMonitorBattlePassUpdates,
  UserBattlePassUpdateMonitor
} from '@scillgame/scill-js';
import {filter, map} from 'rxjs/operators';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';

@Component({
  selector: 'scill-battle-pass-status',
  templateUrl: './battle-pass-status.component.html',
  styleUrls: ['./battle-pass-status.component.scss']
})
export class BattlePassStatusComponent extends BattlePassComponent {

}
