import {Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'scill-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TaskItemComponent implements OnInit, OnDestroy{
    // faCheck = faCheck;
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
    @Input('personal-challenge') personalChallenge: boolean;
    @Input('button-background') buttonBackground: string;
    @Input('button-text-color') buttonTextColor: string;
    constructor(){
    }
    ngOnInit(): void{}
    ngOnDestroy(): void{}
}
