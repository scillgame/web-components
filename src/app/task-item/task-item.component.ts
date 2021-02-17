import { Component, OnInit, Input } from '@angular/core';
import {Challenge}                  from '@scillgame/scill-js';

@Component({
  selector: 'scill-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss']
})
export class TaskItemComponent implements OnInit {
  @Input('task') task: any;   // this need to be Challenge interface but some props are not defined at Challenge interface @scillgame/scill-js SDK
  @Input('background') background: string;
  @Input('progress-fill') progressFill: string;
  @Input('progress-background') progressBackground: string;
  @Input('badge') badge: string;
  constructor() { }

  ngOnInit(): void {
      // console.log('%c progress', 'color:gold;', this.task);
  }

}
