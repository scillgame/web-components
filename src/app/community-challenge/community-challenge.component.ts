import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {PersonalChallengesComponent} from '../personal-challenges/personal-challenges.component';
import {Challenge} from '@scillgame/scill-js';

@Component({
  selector: 'community-challenge',
  templateUrl: './community-challenge.component.html',
  styleUrls: ['./community-challenge.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CommunityChallengeComponent extends PersonalChallengesComponent {

  @Input() challengeId: string;

  challenge: Challenge;

  updateChallenges(): void {
    console.log("Loading challenges: ", this.challengeId);
    this.challengesApi?.getAllPersonalChallenges(this.appId).then(categories => {
      console.log(categories);
      this.categories = categories;
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

  updateChallenge(newChallenge: Challenge): void {
    if (newChallenge.challenge_id === this.challengeId) {
      const updatedChallenge = {};
      Object.assign(updatedChallenge, this.challenge);
      Object.assign(updatedChallenge, newChallenge);
      this.challenge = updatedChallenge;
    }
  }

}
