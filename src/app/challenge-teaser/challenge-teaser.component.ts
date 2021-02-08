import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {CommunityChallengeComponent} from '../community-challenge/community-challenge.component';

@Component({
  selector: 'scill-challenge-teaser',
  templateUrl: './challenge-teaser.component.html',
  styleUrls: ['./challenge-teaser.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class ChallengeTeaserComponent extends CommunityChallengeComponent {

}
