import { BrowserModule } from '@angular/platform-browser';
import {Injector, NgModule} from '@angular/core';
import { AnalyticsCounterComponent } from './analytics-counter/analytics-counter.component';
import {createCustomElement} from '@angular/elements';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { PersonalChallengesComponent } from './personal-challenges/personal-challenges.component';
import {ActiveTillPipe} from './pipes/active-till.pipe';
import {TimeRemainingComponent} from './time-remaining/time-remaining.component';
import {ProgressPipe} from './pipes/progress.pipe';
import { PersonalChallengesListComponent } from './personal-challenges-list/personal-challenges-list.component';
import { PersonalChallengesGridComponent } from './personal-challenges-grid/personal-challenges-grid.component';
import {BattlePassComponent} from './battle-pass/battle-pass.component';
import { BattlePassStatusComponent } from './battle-pass-status/battle-pass-status.component';
import { TaskListComponent } from './task-list/task-list.component';
import { BattlePassMiniStatusComponent } from './battle-pass-mini-status/battle-pass-mini-status.component';

@NgModule({
  declarations: [
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
    BattlePassMiniStatusComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule
  ],
  providers: [],
  entryComponents: [
    AnalyticsCounterComponent,
    PersonalChallengesComponent,
    PersonalChallengesListComponent,
    PersonalChallengesGridComponent,
    BattlePassComponent,
    BattlePassStatusComponent,
    TaskListComponent,
    BattlePassMiniStatusComponent
  ]
})
export class AppModule {
  constructor(private injector: Injector) {

  }

  ngDoBootstrap(): void {
    const analyticsCounter = createCustomElement(AnalyticsCounterComponent, { injector: this.injector });
    customElements.define('analytics-counter', analyticsCounter);

    const personalChallenges = createCustomElement(PersonalChallengesComponent, { injector: this.injector });
    customElements.define('scill-personal-challenges', personalChallenges);

    const personalChallengesList = createCustomElement(PersonalChallengesListComponent, { injector: this.injector });
    customElements.define('scill-personal-challenges-list', personalChallengesList);

    const personalChallengesGrid = createCustomElement(PersonalChallengesGridComponent, { injector: this.injector });
    customElements.define('scill-personal-challenges-grid', personalChallengesGrid)

    const battlePass = createCustomElement(BattlePassComponent, { injector: this.injector });
    customElements.define('scill-battle-pass', battlePass);

    const battlePassStatus = createCustomElement(BattlePassStatusComponent, { injector: this.injector });
    customElements.define('scill-battle-pass-status', battlePassStatus);

    const battlePassMiniStatus = createCustomElement(BattlePassMiniStatusComponent, { injector: this.injector });
    customElements.define('scill-battle-pass-mini-status', battlePassMiniStatus);

    const taskList = createCustomElement(TaskListComponent, { injector: this.injector });
    customElements.define('scill-task-list', taskList);
  }
}
