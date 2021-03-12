import {
    Component,
    ContentChild,
    Input,
    OnChanges,
    OnDestroy,
    OnInit, SimpleChanges,
    TemplateRef,
    ViewEncapsulation
}                                                                     from '@angular/core';
import {
    BattlePass, BattlePassesApi, BattlePassLevel,
    Challenge,
    ChallengeCategory,
    ChallengesApi,
    ChallengeUpdateMonitor, getBattlePassApi,
    getChallengesApi, startMonitorBattlePassUpdates,
    startMonitorChallengeUpdates, UserBattlePassUpdateMonitor
}                                                                     from '@scillgame/scill-js';
import {BehaviorSubject, combineLatest, Observable, of, Subscription} from 'rxjs';
import {filter, map, mergeMap}                                        from 'rxjs/operators';
import {isNotNullOrUndefined}                                         from 'codelyzer/util/isNotNullOrUndefined';
import {SCILLService}                                                 from '../scill.service';
import {fromPromise}                                                  from 'rxjs/internal-compatibility';
import {SCILLBattlePassInfo, SCILLBattlePassService} from '../scillbattle-pass.service';
import {SCILLPersonalChallengesInfo, SCILLPersonalChallengesService} from '../scillpersonal-challenges.service';

@Component({
    selector     : 'scill-personal-challenges',
    templateUrl  : './personal-challenges.component.html',
    styleUrls    : ['./personal-challenges.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PersonalChallengesComponent implements OnInit, OnChanges {

    @Input('app-id') appId: string;
    @Input('user-id') userId: string;
    @Input('battle-pass-id') battlePassId: string;
    @Input('api-key') apiKey: string;
    @Input('access-token') accessToken: string;

  personalChallengesInfo$: Observable<SCILLPersonalChallengesInfo>;

  constructor(private scillService: SCILLService, protected scillPersonalChallengesService: SCILLPersonalChallengesService) {
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
      this.personalChallengesInfo$ = this.scillPersonalChallengesService.getPersonalChallengesInfo(this.appId).pipe(
        map(personalChallengesInfo => {
          return personalChallengesInfo;
        })
      );
    }

    unlockChallenge = (challenge: Challenge): void => {
        // We need to buy the challenge
        this.challengesApi?.unlockPersonalChallenge(this.appId, challenge.challenge_id).then(result => {

        });

    }

    activateChallenge = (challenge: Challenge): void  => {
        // We need to activate the challenge
        this.challengesApi?.activatePersonalChallenge(this.appId, challenge.challenge_id).then(result => {

        });
    }

    claimChallenge = (challenge: Challenge): void  => {
        // We need to buy/claim the challenge
        this.challengesApi?.claimPersonalChallengeReward(this.appId, challenge.challenge_id).then(result => {

        });
    }

    cancelChallenge = (challenge: Challenge): void => {
        this.challengesApi?.cancelPersonalChallenge(this.appId, challenge.challenge_id).then(result => {

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
