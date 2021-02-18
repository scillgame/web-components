import {Component, Input, OnInit, ViewEncapsulation, OnDestroy}                                                      from '@angular/core';
import {PersonalChallengesComponent}                                                                      from '../personal-challenges/personal-challenges.component';
import {filter, map}                                                                                      from 'rxjs/operators';
import {isNotNullOrUndefined}                                                                             from 'codelyzer/util/isNotNullOrUndefined';
import {
    Challenge,
    ChallengeCategory,
    ChallengesApi,
    ChallengeUpdateMonitor,
    getChallengesApi,
    startMonitorChallengeUpdates
} from '@scillgame/scill-js';
import {SCILLService}                                                                                     from '../scill.service';
import {BehaviorSubject, Subscription}                                                                    from 'rxjs';

@Component({
    selector   : 'scill-popover-preview',
    templateUrl: './popover-preview.component.html',
    styleUrls  : ['./popover-preview.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PopoverPreviewComponent implements OnInit, OnDestroy{

    @Input() accessToken: string;
    @Input() apiKey: string;
    @Input() userId: string;
    @Input() appId: string;
    @Input('title') popoverPreviewSectionTitle: string;
    @Input('state-in-progress-color') stateInProgressColor: string;
    @Input('state-finished-color') stateFinishedColor: string;
    @Input('state-border-color') stateBorderColor: string;
    @Input('state-icon-color') stateIconColor: string;
    @Input() challenges: Challenge[];
    @Input('task') task: any;   // this need to be Challenge interface but some props are not defined at Challenge interface @scillgame/scill-js SDK
    @Input('background') background: string;
    @Input('progress-fill') progressFill: string;
    @Input('progress-background') progressBackground: string;
    @Input('badge') badge: string;
    accessToken$ = new BehaviorSubject<string>(null);
    challengesApi$ = new BehaviorSubject<ChallengesApi>(null);
    subscriptions: Subscription = new Subscription();
    challengeMonitor: ChallengeUpdateMonitor;
    categories: ChallengeCategory[] = [];
    isPopoverPreviewVisible = true;
    isBattlepassExpanded = true;
    isChallengesExpanded: boolean;
    isCollapsed = true;

    constructor(private scillService: SCILLService) { }

    get challengesApi(): ChallengesApi {
        return this.challengesApi$.getValue();
    }
    ngOnInit(): void {
        this.scillService.getAccessToken(this.apiKey, this.userId).subscribe(result => {
            if (result) {
                this.accessToken$.next(result);
            }
        });

        this.accessToken$.pipe(
            filter(isNotNullOrUndefined),
            map(accessToken => {
                if (this.challengeMonitor) {
                    this.challengeMonitor.stop();
                }
                this.challengeMonitor = startMonitorChallengeUpdates(accessToken, (payload) => {
                    // Update challenge if realtime update comes in
                    console.log('Incoming message:', payload);
                    this.updateChallenge(payload.new_challenge);
                    // this.updateChallenges();
                });
                return getChallengesApi(accessToken);
            })
        ).subscribe(this.challengesApi$);

        this.subscriptions.add(this.challengesApi$.pipe(filter(isNotNullOrUndefined)).subscribe(challengesApi => {
            this.updateChallenges();
        }));
    }
    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
        if (this.challengeMonitor) {
            this.challengeMonitor.stop();
        }
    }
    toggleSection(section: string): void {
        this[section] = !this[section];
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

        console.log(newChallenge, this.categories);
    }

    updateChallenges(): void {
        this.challengesApi?.getAllPersonalChallenges(this.appId).then(categories => {
            console.log(categories);
            this.categories = categories;
        });
    }
    challengeById(index: number, item: Challenge): string {
        return item.challenge_id;
    }
}
