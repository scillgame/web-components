import {Component, Input, OnInit, EventEmitter, Output} from '@angular/core';
import {SCILLNotification} from '../scill.service';

@Component({
  selector: 'scill-image-search-notification',
  templateUrl: './image-search-notification.component.html',
  styleUrls: ['./image-search-notification.component.scss']
})
export class ImageSearchNotificationComponent implements OnInit {

  @Input() notification: SCILLNotification;
  @Output() onClose = new EventEmitter();
  @Input() imageUrl;

  constructor() { }

  ngOnInit(): void {
  }

  closeNotification(): void {
    this.onClose.emit();
  }

}
