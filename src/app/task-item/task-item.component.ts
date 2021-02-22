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
    @Input('type-in-progress-color') typeInProgressColor: string;
    @Input('type-finished-color') typeFinishedColor: string;
    @Input('type-border-color') typeBorderColor: string;
    @Input('type-icon-color') typeIconColor: string;
    // @Input() task: any;
    @Input('background') background: string;
    @Input('progress-percentage') progressPercentage: string;
    @Input('progress-fill') progressFill: string;
    @Input('progress-background') progressBackground: string;
    @Input('badge') badge: string;
    constructor(){
    }
    ngOnInit(): void{}
    ngOnDestroy(): void{}
}
