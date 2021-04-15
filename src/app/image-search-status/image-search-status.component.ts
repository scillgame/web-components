import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation} from '@angular/core';
import {PersonalChallengesComponent} from '../personal-challenges/personal-challenges.component';
import {Observable} from 'rxjs';
import {SCILLPersonalChallengesInfo, SCILLPersonalChallengesService} from '../scillpersonal-challenges.service';
import {map} from 'rxjs/operators';
import {SCILLService} from '../scill.service';
import {Challenge, ChallengesApi} from '@scillgame/scill-js';
import {HttpClient} from '@angular/common/http';
import {ImageSearchConfig} from '../image-search/image-search.component';

@Component({
  selector: 'scill-image-search-status',
  templateUrl: './image-search-status.component.html',
  styleUrls: ['./image-search-status.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ImageSearchStatusComponent implements OnInit, OnChanges {

  @Input('app-id') appId: string;
  @Input('user-id') userId: string;
  @Input('battle-pass-id') battlePassId: string;
  @Input('api-key') apiKey: string;
  @Input('access-token') accessToken: string;
  @Input('language') language: string;
  @Input('challenge-id') challengeId: string;
  @Input('title') title: string;
  @Input('config-url') configUrl: any;

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

    this.http.get(this.configUrl).subscribe(config => {
      this.config = config as ImageSearchConfig;
    });
  }

  challengeById(index: number, item: Challenge): string {
    return item.challenge_id;
  }

  toggleSection(section: string): void {
    this[section] = !this[section];
  }

  // return number of completed challenges inside challenge category
  // pipe is not neccessary for this because this is not common/reusable component
  calculateCompletedChallenges(challenges): number {
    let counter = 0;
    if (challenges.length < 1) {
      return null;
    }
    challenges.map(ch => {
      if (ch.type === 'finished') {
        counter++;
      }
      return ch;
    });
    return counter;
  }

  convertToPxl(position: number): string {
    return position + 'px';
  }


}
