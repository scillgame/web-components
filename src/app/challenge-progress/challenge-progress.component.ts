import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Observable} from 'rxjs';
import {SCILLPersonalChallengesInfo, SCILLPersonalChallengesService} from '../scillpersonal-challenges.service';
import {ImageSearchConfig} from '../image-search/image-search.component';
import {SCILLService} from '../scill.service';
import {HttpClient} from '@angular/common/http';
import {Challenge, ChallengesApi} from '@scillgame/scill-js';
import {map} from 'rxjs/operators';

@Component({
  selector: 'scill-challenge-progress',
  templateUrl: './challenge-progress.component.html',
  styleUrls: ['./challenge-progress.component.scss']
})
export class ChallengeProgressComponent implements OnInit, OnChanges {

  @Input('app-id') appId: string;
  @Input('user-id') userId: string;
  @Input('access-token') accessToken: string;
  @Input('language') language: string;
  @Input('challenge-id') challengeId: string;
  @Input('height') height = '20';
  @Input('background') progressBackground = 'black';
  @Input('fill-background') progressFillBackground = 'red';
  @Input('border-radius') borderRadius = '0';
  @Input('title') title: string;

  personalChallengesInfo$: Observable<SCILLPersonalChallengesInfo>;
  config: ImageSearchConfig;

  constructor(private scillService: SCILLService, protected scillPersonalChallengesService: SCILLPersonalChallengesService, private http: HttpClient) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.accessToken && changes.accessToken.currentValue) {
      this.scillService.setAccessToken(changes.accessToken.currentValue);
    }
  }

  get challengesApi(): ChallengesApi {
    return this.scillService.challengesApi$.getValue();
  }

  ngOnInit(): void {
    this.personalChallengesInfo$ = this.scillPersonalChallengesService.getPersonalChallengeInfo(this.appId, this.challengeId).pipe(
      map(personalChallengesInfo => {
        console.log(personalChallengesInfo);
        return personalChallengesInfo;
      })
    );
  }
}
