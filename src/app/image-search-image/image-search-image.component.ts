import {Component, Input, OnInit, EventEmitter, Output} from '@angular/core';
import {ImageInfo} from '../image-search/image-search.component';
import {SCILLService} from '../scill.service';

@Component({
  selector: 'scill-image-search-image',
  templateUrl: './image-search-image.component.html',
  styleUrls: ['./image-search-image.component.scss']
})
export class ImageSearchImageComponent implements OnInit {

  @Input() imageInfo: ImageInfo;
  @Input() maxImageWidth: string;
  @Output() imageClicked = new EventEmitter<ImageInfo>();

  constructor(private scillService: SCILLService) { }

  ngOnInit(): void {
  }

  collectImage(imageInfo: ImageInfo): void {
    this.imageClicked.emit(imageInfo);
  }
}
