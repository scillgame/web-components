import {Component, Input, OnInit} from '@angular/core';
import {PersonalChallengesComponent} from '../personal-challenges/personal-challenges.component';
import {Observable} from 'rxjs';
import {SCILLPersonalChallengesInfo} from '../scillpersonal-challenges.service';
import {map} from 'rxjs/operators';

@Component({
  selector: 'scill-image-search-status',
  templateUrl: './image-search-status.component.html',
  styleUrls: ['./image-search-status.component.scss']
})
export class ImageSearchStatusComponent extends PersonalChallengesComponent implements OnInit {
  @Input() challengeId: string;

  personalChallengesInfo$: Observable<SCILLPersonalChallengesInfo>;

  ngOnInit(): void {
    this.personalChallengesInfo$ = this.scillPersonalChallengesService.getPersonalChallengeInfo(this.appId, this.challengeId).pipe(
      map(personalChallengesInfo => {
        return personalChallengesInfo;
      })
    );
  }
}
