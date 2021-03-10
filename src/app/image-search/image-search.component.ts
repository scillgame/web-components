import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

export class ImageSearchConfig {
  images: string[];
}

const imageSearchConfig: ImageSearchConfig = {
  images: [
    'https://www.volvocars.com/images/v/de/v/-/media/project/contentplatform/data/media/recharge/charging_entry_point_4_3.jpg?iar=0&w=1920',
    'https://assets.volvocars.com/de/~/media/shared-assets/master/images/pages/why-volvo/human-innovation/electrification/pure-electric/itemslist_1b.jpg?w=820',
    'https://www.volvocars.com/images/v/de/v/-/media/project/contentplatform/data/media/my22/xc40-electric/xc40-bev-gallery-4-16x9.jpg?h=1300&iar=0'
  ]
};

@Component({
  selector: 'scill-image-search',
  templateUrl: './image-search.component.html',
  styleUrls: ['./image-search.component.scss']
})
export class ImageSearchComponent implements OnInit {

  @Input() configUrl;
  config: ImageSearchConfig = imageSearchConfig;

  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
    
  }

}
