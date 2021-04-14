import {Component, Input, OnInit} from '@angular/core';
import {ImageInfo} from '../image-search/image-search.component';
import {SCILLService} from '../scill.service';

@Component({
  selector: 'scill-image-search-image',
  templateUrl: './image-search-image.component.html',
  styleUrls: ['./image-search-image.component.scss']
})
export class ImageSearchImageComponent implements OnInit {

  @Input() imageInfo: ImageInfo;
  @Input() userId: string;
  @Input() maxImageWidth: string;

  constructor(private scillService: SCILLService) { }

  ngOnInit(): void {
  }

  collectImage(imageInfo: ImageInfo): void {
    this.imageInfo = null;
    this.scillService.sendEvent('collect-item', this.userId, this.userId, {
      item_type: 'image',
      amount: 1
    }).subscribe(result => {
      console.log("Image Collected", result);
    });
  }
}
