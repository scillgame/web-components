import {BrowserModule}                   from '@angular/platform-browser';
import {Injector, NgModule}              from '@angular/core';
import {AnalyticsCounterComponent}       from './analytics-counter/analytics-counter.component';
import {createCustomElement}             from '@angular/elements';
import {BrowserAnimationsModule}         from '@angular/platform-browser/animations';
import {PersonalChallengesComponent}     from './personal-challenges/personal-challenges.component';
import {ActiveTillPipe}                  from './pipes/active-till.pipe';
import {TimeRemainingComponent}          from './time-remaining/time-remaining.component';
import {ProgressPipe}                    from './pipes/progress.pipe';
import {PersonalChallengesListComponent} from './personal-challenges-list/personal-challenges-list.component';
import {PersonalChallengesGridComponent} from './personal-challenges-grid/personal-challenges-grid.component';
import {BattlePassComponent}             from './battle-pass/battle-pass.component';
import {BattlePassStatusComponent}       from './battle-pass-status/battle-pass-status.component';
import {TaskListComponent}               from './task-list/task-list.component';
import {BattlePassMiniStatusComponent}   from './battle-pass-mini-status/battle-pass-mini-status.component';
import {CommunityChallengeComponent}     from './community-challenge/community-challenge.component';
import {ChallengeTeaserComponent}        from './challenge-teaser/challenge-teaser.component';
import {PopoverPreviewComponent}         from './popover-preview/popover-preview.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { TaskItemComponent } from './task-item/task-item.component';
import { PopoverPreviewSectionComponent } from './popover-preview-section/popover-preview-section.component';
import { PopoverPreviewHeaderComponent } from './popover-preview-header/popover-preview-header.component';
import { PopoverPreviewBpSectionComponent } from './popover-preview-bp-section/popover-preview-bp-section.component';
import { ProfileButtonComponent } from './profile-button/profile-button.component';
import { PopoverComponent } from './popover/popover.component';
import { CompletedChallengesPipe } from './pipes/completed-challenges.pipe';
import { CompletedLevelsPipe } from './pipes/completed-levels.pipe';

@NgModule({
    declarations   : [
        AnalyticsCounterComponent,
        PersonalChallengesComponent,
        ActiveTillPipe,
        ProgressPipe,
        TimeRemainingComponent,
        PersonalChallengesListComponent,
        PersonalChallengesGridComponent,
        BattlePassComponent,
        BattlePassStatusComponent,
        TaskListComponent,
        BattlePassMiniStatusComponent,
        CommunityChallengeComponent,
        ChallengeTeaserComponent,
        PopoverPreviewComponent,
        ProgressBarComponent,
        TaskItemComponent,
        PopoverPreviewSectionComponent,
        PopoverPreviewHeaderComponent,
        PopoverPreviewBpSectionComponent,
        ProfileButtonComponent,
        PopoverComponent,
        CompletedChallengesPipe,
        CompletedLevelsPipe
    ],
    imports        : [
        BrowserModule,
        BrowserAnimationsModule,
    ],
    providers      : [],
    entryComponents: [
        AnalyticsCounterComponent,
        PersonalChallengesComponent,
        PersonalChallengesListComponent,
        PersonalChallengesGridComponent,
        BattlePassComponent,
        BattlePassStatusComponent,
        BattlePassMiniStatusComponent,
        TaskListComponent,
        CommunityChallengeComponent,
        ChallengeTeaserComponent,
        PopoverPreviewComponent
    ]
})
export class AppModule {
    constructor(private injector: Injector) {

    }

    ngDoBootstrap(): void {
        const analyticsCounter = createCustomElement(AnalyticsCounterComponent, {injector: this.injector});
        customElements.define('analytics-counter', analyticsCounter);

        const personalChallenges = createCustomElement(PersonalChallengesComponent, {injector: this.injector});
        customElements.define('scill-personal-challenges', personalChallenges);

        const personalChallengesList = createCustomElement(PersonalChallengesListComponent, {injector: this.injector});
        customElements.define('scill-personal-challenges-list', personalChallengesList);

        const personalChallengesGrid = createCustomElement(PersonalChallengesGridComponent, {injector: this.injector});
        customElements.define('scill-personal-challenges-grid', personalChallengesGrid);

        const battlePass = createCustomElement(BattlePassComponent, {injector: this.injector});
        customElements.define('scill-battle-pass', battlePass);

        const battlePassStatus = createCustomElement(BattlePassStatusComponent, {injector: this.injector});
        customElements.define('scill-battle-pass-status', battlePassStatus);

        const battlePassMiniStatus = createCustomElement(BattlePassMiniStatusComponent, {injector: this.injector});
        customElements.define('scill-battle-pass-mini-status', battlePassMiniStatus);

        const taskList = createCustomElement(TaskListComponent, {injector: this.injector});
        customElements.define('scill-task-list', taskList);

        const communityChallenge = createCustomElement(CommunityChallengeComponent, {injector: this.injector});
        customElements.define('scill-community-challenge', communityChallenge);

        const challengeTeaser = createCustomElement(ChallengeTeaserComponent, {injector: this.injector});
        customElements.define('scill-challenge-teaser', challengeTeaser);

        const popoverPreview = createCustomElement(PopoverPreviewComponent, {injector: this.injector});
        customElements.define('scill-popover-preview', popoverPreview);

        const profileButton = createCustomElement(ProfileButtonComponent, {injector: this.injector});
        customElements.define('scill-profile-button', profileButton);

        const popover = createCustomElement(PopoverComponent, {injector: this.injector});
        customElements.define('scill-popover', popover);
    }
}
