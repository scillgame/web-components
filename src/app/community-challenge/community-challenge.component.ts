import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {PersonalChallengesComponent} from '../personal-challenges/personal-challenges.component';
import {Challenge} from '@scillgame/scill-js';

@Component({
  selector: 'community-challenge',
  templateUrl: './community-challenge.component.html',
  styleUrls: ['./community-challenge.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class CommunityChallengeComponent extends PersonalChallengesComponent {

  @Input() challengeId: string;
  @Input() primaryColor = '#51b6c8';
  @Input() textColor = 'black';

  challenge: Challenge;

  updateChallenges(): void {
    this.challengesApi?.getAllPersonalChallenges(this.appId).then(categories => {
      for (const category of categories) {
        for (const challenge of category.challenges) {
          if (challenge.challenge_id === this.challengeId) {
            this.challenge = challenge;
            break;
          }
        }
      }
    });
  }

}
