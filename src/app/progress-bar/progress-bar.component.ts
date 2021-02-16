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

    constructor() {

    }

    ngOnInit(): void {
        this.progressPercentage =this.progressPercentage * 100 + '%';
        console.log('%c progress', 'color:gold;', this.progressPercentage);
        // console.log('%c BACKGROUND', 'color:gold;', this.progressBackground);
        // console.log('%c FILL', 'color:gold;', this.progressFillBackground);
    }

}
