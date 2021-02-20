import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import { faCheck }                           from '@fortawesome/free-solid-svg-icons';
import {Challenge}                           from '@scillgame/scill-js';

@Component({
  selector: 'scill-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss']
})
export class TaskItemComponent implements OnInit, OnDestroy{
    faCheck = faCheck;
    @Input('task') task: any;
    @Input('title') popoverPreviewSectionTitle: string;
    @Input('state-in-progress-color') stateInProgressColor: string;
    @Input('state-finished-color') stateFinishedColor: string;
    @Input('state-border-color') stateBorderColor: string;
    @Input('state-icon-color') stateIconColor: string;
    // @Input() task: any;
    @Input('background') background: string;
    @Input('progress-fill') progressFill: string;
    @Input('progress-background') progressBackground: string;
    @Input('badge') badge: string;
    constructor(){
    }
    ngOnInit(): void{}
    ngOnDestroy(): void{}
}
