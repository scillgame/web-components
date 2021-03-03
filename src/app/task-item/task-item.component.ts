import {Component, Input, OnDestroy, OnInit, SimpleChanges, ViewEncapsulation} from '@angular/core';
import {BattlePassLevelChallenge, Challenge, ChallengesApi} from '@scillgame/scill-js';
import {SCILLService} from '../scill.service';
import {SCILLPersonalChallengesService} from '../scillpersonal-challenges.service';

@Component({
  selector: 'scill-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TaskItemComponent {
  // faCheck = faCheck;
  @Input('app-id') appId: string;
  @Input('task') task: any;
  @Input('title') popoverPreviewSectionTitle: string;
  @Input('type-finished-color') typeFinishedColor: string;
  @Input('type-border-color') typeBorderColor: string;
  @Input('type-icon-color') typeIconColor: string;
  // @Input() task: any;
  @Input('background') background: string;
  @Input('progress-percentage') progressPercentage: string;
  @Input('progress-fill') progressFill: string;
  @Input('progress-background') progressBackground: string;
  @Input('personal-challenge') personalChallenge: boolean;
  @Input('button-background') buttonBackground: string;
  @Input('button-text-color') buttonTextColor: string;

  constructor(private scillService: SCILLService, private scillPersonalChallengesService: SCILLPersonalChallengesService) {
  }

  get challengesApi(): ChallengesApi {
    return this.scillService.challengesApi$.getValue();
  }

  unlockChallenge(challenge: Challenge): void {
    // We need to buy the challenge
    this.challengesApi?.unlockPersonalChallenge(this.appId, challenge.challenge_id).then(result => {

    });
  }

  activateChallenge(challenge: Challenge): void {
    // We need to activate the challenge
    this.challengesApi?.activatePersonalChallenge(this.appId, challenge.challenge_id).then(result => {

    });
  }

  claimChallenge(challenge: Challenge): void {
    // We need to buy/claim the challenge
    this.challengesApi?.claimPersonalChallengeReward(this.appId, challenge.challenge_id).then(result => {

    });
  }

  cancelChallenge(challenge: Challenge): void {
    this.challengesApi?.cancelPersonalChallenge(this.appId, challenge.challenge_id).then(result => {

    });
  }
}
