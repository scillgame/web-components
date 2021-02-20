import {Component, Input, OnInit, ViewEncapsulation, OnDestroy}                                           from '@angular/core';
import {BehaviorSubject, Subscription}                                                                    from 'rxjs';
import {
    Challenge,
    ChallengeCategory,
    ChallengesApi,
    ChallengeUpdateMonitor,
    getChallengesApi,
    startMonitorChallengeUpdates
} from '@scillgame/scill-js';
import {filter, map}                                                                                      from 'rxjs/operators';
import {isNotNullOrUndefined}                                                                             from 'codelyzer/util/isNotNullOrUndefined';
import {SCILLService}                                                                                     from '../scill.service';

@Component({
    selector     : 'scill-popover-preview',
    templateUrl  : './popover-preview.component.html',
    styleUrls    : ['./popover-preview.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PopoverPreviewComponent implements OnInit, OnDestroy {
    @Input() apiKey: string;
    @Input() appId: string;
    @Input() userId: string;
    @Input() battlePassId: string;
    @Input('access-token') accessToken: string;
    @Input('challenge-id') challengeId: string;
    @Input('username') username: string;
    @Input() category: ChallengeCategory;
    isPopoverPreviewVisible: boolean = true;
    challengeMonitor: ChallengeUpdateMonitor;
    challengesApi$ = new BehaviorSubject<ChallengesApi>(null);
    accessToken$ = new BehaviorSubject<string>(null);
    subscriptions: Subscription = new Subscription();
    categories: ChallengeCategory[] = [];

    constructor(private scillService: SCILLService) { }
    get challengesApi(): ChallengesApi {
        return this.challengesApi$.getValue();
    }
    ngOnInit(): void {
        console.log('on init');
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
                    console.log("Incoming message:", payload);
                    this.updateChallenge(payload.new_challenge);
                    //this.updateChallenges();
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
    }
    updateChallenges(): void {
        this.challengesApi?.getAllPersonalChallenges(this.appId).then(categories => {
            this.categories = categories;
        });
    }

}
