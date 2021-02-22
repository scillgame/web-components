import {
  Component,
  ContentChild,
  Input,
  OnChanges,
  OnDestroy,
  OnInit, SimpleChanges,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import {
  Challenge,
  ChallengeCategory,
  ChallengesApi,
  ChallengeUpdateMonitor,
  getChallengesApi,
  startMonitorChallengeUpdates
} from '@scillgame/scill-js';
import {BehaviorSubject, Subscription} from 'rxjs';
import {filter, map} from 'rxjs/operators';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';
import {SCILLService} from '../scill.service';

@Component({
  selector: 'scill-personal-challenges',
  templateUrl: './personal-challenges.component.html',
  styleUrls: ['./personal-challenges.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PersonalChallengesComponent implements OnInit, OnDestroy, OnChanges {

  @Input() accessToken: string;
  @Input() appId: string;

  accessToken$ = new BehaviorSubject<string>(null);
  challengesApi$ = new BehaviorSubject<ChallengesApi>(null);
  subscriptions: Subscription = new Subscription();
  categories: ChallengeCategory[] = [];
  challengeMonitor: ChallengeUpdateMonitor;

  @ContentChild('challengeTemplate', { static: false })
  challengeTemplateRef: TemplateRef<any>;

  constructor() { }

  get challengesApi(): ChallengesApi {
    return this.challengesApi$.getValue();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['accessToken'] && changes['accessToken'].currentValue) {
      this.accessToken$.next(changes['accessToken'].currentValue);
    }
  }

  ngOnInit(): void {
    this.accessToken$.pipe(
      filter(isNotNullOrUndefined),
      map(accessToken => {
        if (this.challengeMonitor) {
          this.challengeMonitor.stop();
        }
        this.challengeMonitor = startMonitorChallengeUpdates(accessToken, (payload) => {
          // Update challenge if realtime update comes in
          this.updateChallenge(payload.new_challenge);
        });
        return getChallengesApi(accessToken);
      })
    ).subscribe(this.challengesApi$);

    this.subscriptions.add(this.challengesApi$.pipe(filter(isNotNullOrUndefined)).subscribe(challengesApi => {
      this.updateChallenges();
    }));

    if (this.accessToken) {
      this.accessToken$.next(this.accessToken);
    }
  }

  updateChallenge(newChallenge: Challenge): void {
    for (const category of this.categories) {
      for (let i = 0; i < category.challenges.length; i++) {
        if (category.challenges[i].challenge_id === newChallenge.challenge_id) {
          // Create a copy of the original challenge and overwrite with new challenge
          const updatedChallenge = {};
          Object.assign(updatedChallenge, category.challenges[i]);
          Object.assign(updatedChallenge, newChallenge);
          category.challenges.splice(i, 1, updatedChallenge);
          break;
        }
      }
    }
  }

  updateChallenges(): void {
    this.challengesApi?.getAllPersonalChallenges(this.appId).then(categories => {
      this.categories = categories;
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    if (this.challengeMonitor) {
      this.challengeMonitor.stop();
    }
  }

  unlockChallenge(challenge: Challenge): void {
    // We need to buy the challenge
    this.challengesApi?.unlockPersonalChallenge(this.appId, challenge.challenge_id).then(result => {
      this.updateChallenge(result.challenge);
    });
  }

  activateChallenge(challenge: Challenge): void {
    // We need to activate the challenge
    this.challengesApi?.activatePersonalChallenge(this.appId, challenge.challenge_id).then(result => {
      this.updateChallenge(result.challenge);
    });
  }

  claimChallenge(challenge: Challenge): void {
    // We need to buy/claim the challenge
    this.challengesApi?.claimPersonalChallengeReward(this.appId, challenge.challenge_id).then(result => {
      this.updateChallenge(result.challenge);
    });
  }

  cancelChallenge(challenge: Challenge): void {
    this.challengesApi?.cancelPersonalChallenge(this.appId, challenge.challenge_id).then(result => {
      this.updateChallenge(result.challenge);
    });
  }

  challengeById(index: number, item: Challenge): string {
    return item.challenge_id;
  }

}
