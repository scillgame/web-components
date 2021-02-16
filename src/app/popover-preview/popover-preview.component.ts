import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
    selector   : 'scill-popover-preview',
    templateUrl: './popover-preview.component.html',
    styleUrls  : ['./popover-preview.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PopoverPreviewComponent implements OnInit {

    @Input('access-token') accessToken: string;
    isPopoverPreviewVisible: boolean;
    constructor() {
    }

    ngOnInit(): void {
        console.log('%c THIS IS MY ACCESS TOKEN @PopoverPreview Component', 'color:gold;', this.accessToken);
    }
    togglePopoverPreview(): void {
        this.isPopoverPreviewVisible = !this.isPopoverPreviewVisible;
    }

}
