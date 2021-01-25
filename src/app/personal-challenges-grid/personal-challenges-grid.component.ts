import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {PersonalChallengesComponent} from '../personal-challenges/personal-challenges.component';

@Component({
  selector: 'scill-personal-challenges-grid',
  templateUrl: './personal-challenges-grid.component.html',
  styleUrls: ['./personal-challenges-grid.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PersonalChallengesGridComponent extends PersonalChallengesComponent {


}
