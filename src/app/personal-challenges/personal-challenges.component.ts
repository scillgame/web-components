import {
    Component,
    ContentChild,
    Input,
    OnChanges,
    OnDestroy,
    OnInit, SimpleChanges,
    TemplateRef,
    ViewEncapsulation
}                                      from '@angular/core';
import {
    BattlePass, BattlePassesApi,
    Challenge,
    ChallengeCategory,
    ChallengesApi,
    ChallengeUpdateMonitor, getBattlePassApi,
    getChallengesApi, startMonitorBattlePassUpdates,
    startMonitorChallengeUpdates, UserBattlePassUpdateMonitor
}                                      from '@scillgame/scill-js';
import {BehaviorSubject, Subscription} from 'rxjs';
import {filter, map, mergeMap}         from 'rxjs/operators';
import {isNotNullOrUndefined}          from 'codelyzer/util/isNotNullOrUndefined';
import {SCILLService}                  from '../scill.service';
import {fromPromise}                   from 'rxjs/internal-compatibility';

let that = null;

@Component({
    selector     : 'scill-personal-challenges',
    templateUrl  : './personal-challenges.component.html',
    styleUrls    : ['./personal-challenges.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PersonalChallengesComponent implements OnInit, OnDestroy, OnChanges {

    @Input('app-id') appId: string;
    @Input('user-id') userId: string;
    @Input('battle-pass-id') battlePassId: string;
    @Input('api-key') apiKey: string;
    @Input('access-token') accessToken: string;
    @Input() category: ChallengeCategory;
    @Input() challenges: Challenge[];
                     accessToken$                    = new BehaviorSubject<string>(null);
                     challengesApi$                  = new BehaviorSubject<ChallengesApi>(null);
                     battlePass$                     = new BehaviorSubject<BattlePass>(null);
                     battlePassApi$                  = new BehaviorSubject<BattlePassesApi>(null);
                     monitorBattlePass: UserBattlePassUpdateMonitor;
                     refresh$                        = new BehaviorSubject<boolean>(false);
                     subscriptions: Subscription     = new Subscription();
                     categories: ChallengeCategory[] = [];
                     challengeMonitor: ChallengeUpdateMonitor;
                     isExpanded: boolean             = true;
                     battlePass: BattlePass;

    @ContentChild('challengeTemplate', {static: false})
    challengeTemplateRef: TemplateRef<any>;


    constructor() {
    }

    get challengesApi(): ChallengesApi {
        return this.challengesApi$.getValue();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['accessToken'] && changes['accessToken'].currentValue) {
            this.accessToken$.next(changes['accessToken'].currentValue);
        }
    }

    ngOnInit(): void {
        that = this;
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

        try {
            this.accessToken$.pipe(
                filter(isNotNullOrUndefined),
                map(accessToken => {
                    if (this.monitorBattlePass) {
                        this.monitorBattlePass.stop();
                    }

                    this.monitorBattlePass = startMonitorBattlePassUpdates(accessToken, this.battlePassId, (payload => {
                        this.refresh$.next(true);
                    }));


                    return getBattlePassApi(accessToken);
                })
            ).subscribe(this.battlePassApi$);

            this.battlePassApi$.pipe(
                filter(isNotNullOrUndefined),
                mergeMap(battlePassApi => {
                    return fromPromise(battlePassApi.getBattlePasses(this.appId, this.battlePassId)).pipe(
                        map(battlePasses => {
                                console.log(battlePasses);
                                const foundBattlePass = battlePasses.filter(battlePass => battlePass.battle_pass_id === this.battlePassId)[0];
                                this.battlePass       = foundBattlePass;
                                console.log('FOUD', foundBattlePass);
                                return foundBattlePass;
                            }
                        ));
                })
            ).subscribe(this.battlePass$);
        } catch (e) {
            console.log(e);
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

    unlockChallenge = (challenge: Challenge): void => {
        // We need to buy the challenge
        this.challengesApi?.unlockPersonalChallenge(this.appId, challenge.challenge_id).then(result => {
            this.updateChallenge(result.challenge);
        });

    };

    activateChallenge = (challenge: Challenge): void  => {
        // We need to activate the challenge
        this.challengesApi?.activatePersonalChallenge(this.appId, challenge.challenge_id).then(result => {
            this.updateChallenge(result.challenge);
        });
        console.log('%c CATEGORIES', 'color:gold;', this.categories);
    }

    claimChallenge = (challenge: Challenge): void  => {
        // We need to buy/claim the challenge
        this.challengesApi?.claimPersonalChallengeReward(this.appId, challenge.challenge_id).then(result => {
            this.updateChallenge(result.challenge);
        });
    }

    cancelChallenge = (challenge: Challenge): void => {
        this.challengesApi?.cancelPersonalChallenge(this.appId, challenge.challenge_id).then(result => {
            this.updateChallenge(result.challenge);
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
