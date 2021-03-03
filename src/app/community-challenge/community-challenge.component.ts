import {Component, Input, OnInit, SimpleChanges, ViewEncapsulation} from '@angular/core';
import {PersonalChallengesComponent} from '../personal-challenges/personal-challenges.component';
import {Challenge, ChallengesApi} from '@scillgame/scill-js';
import {Observable} from 'rxjs';
import {SCILLPersonalChallengesInfo, SCILLPersonalChallengesService} from '../scillpersonal-challenges.service';
import {SCILLService} from '../scill.service';
import {map} from 'rxjs/operators';

@Component({
  selector: 'community-challenge',
  templateUrl: './community-challenge.component.html',
  styleUrls: ['./community-challenge.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CommunityChallengeComponent extends PersonalChallengesComponent implements OnInit {

  @Input() challengeId: string;

  personalChallengesInfo$: Observable<SCILLPersonalChallengesInfo>;

  ngOnInit(): void {
    this.personalChallengesInfo$ = this.scillPersonalChallengesService.getPersonalChallengeInfo(this.appId, this.challengeId).pipe(
      map(personalChallengesInfo => {
        console.log(personalChallengesInfo);
        return personalChallengesInfo;
      })
    );
  }

}
