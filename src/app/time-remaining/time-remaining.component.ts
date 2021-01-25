import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription, timer} from "rxjs";
import {map} from "rxjs/operators";
import {Challenge, timeLeft} from '@scillgame/scill-js';

interface TimeRemaining {
  seconds: number;
  minutes: number;
  hours: number;
  days: number;
}

@Component({
  selector: 'app-time-remaining',
  templateUrl: './time-remaining.component.html',
  styleUrls: ['./time-remaining.component.scss']
})
export class TimeRemainingComponent implements OnInit, OnDestroy {

  @Input() challenge: Challenge;
  subscriptions = new Subscription();

  timeRemaining$: Observable<string>;

  constructor() { }

  ngOnInit(): void {
    this.timeRemaining$ = timer(0, 1000).pipe(
      map(result => {
        const timeRemaining = timeLeft(this.challenge);
        return timeRemaining;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
