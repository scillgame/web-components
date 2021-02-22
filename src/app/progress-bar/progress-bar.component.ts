import {Component, OnInit, Input} from '@angular/core';

@Component({
    selector   : 'scill-progress-bar',
    templateUrl: './progress-bar.component.html',
    styleUrls  : ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit {
    @Input('background') progressBackground: string;
    @Input('fill-background') progressFillBackground: string;
    @Input('progress') progressPercentage: any;
    @Input('transform') transform: string;
    @Input('padding') padding: string;
    @Input('border-radius') borderRadius: string;
    @Input('task-type') taskType: string;

    constructor() {

    }

    ngOnInit(): void {
        console.log('%c PROGRESS', 'color:gold;', this.progressPercentage);
    }

}
