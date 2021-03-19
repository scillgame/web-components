import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SCILLPersonalChallengesInfo, SCILLPersonalChallengesService} from '../scillpersonal-challenges.service';
import {BehaviorSubject, combineLatest, Observable} from 'rxjs';
import {filter, map, withLatestFrom} from 'rxjs/operators';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';
import {SCILLNotification, SCILLService} from '../scill.service';

export class ImageSearchConfig {
  images: string[];
  distribution: number[];
  variance: number;
}

class ImageInfo {
  imageIndex: number;
  imageUrl: string;
  top: number;
  left: number;
}

const imageSearchConfig: ImageSearchConfig = {
  images: [
    'https://www.volvocars.com/images/v/de/v/-/media/project/contentplatform/data/media/recharge/charging_entry_point_4_3.jpg?iar=0&w=1920',
    'https://assets.volvocars.com/de/~/media/shared-assets/master/images/pages/why-volvo/human-innovation/electrification/pure-electric/itemslist_1b.jpg?w=820',
    'https://www.volvocars.com/images/v/de/v/-/media/project/contentplatform/data/media/my22/xc40-electric/xc40-bev-gallery-4-16x9.jpg?h=1300&iar=0',
    'https://www.volvocars.com/images/v/de/v/-/media/project/contentplatform/data/media/pdp/xc60-hybrid/xc60-recharge-gallery-5-16x9.jpg?h=1300&iar=0'
  ],
  distribution: [1, 8, 13, 20],
  variance: 2
};

@Component({
  selector: 'scill-image-search',
  templateUrl: './image-search.component.html',
  styleUrls: ['./image-search.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class ImageSearchComponent implements OnInit, OnChanges {

  @Input('config-url') configUrl;
  @Input('app-id') appId;
  @Input('user-id') userId;
  @Input('driver-challenge-id') driverChallengeId;
  @Input('challenge-id') challengeId;
  @Input('access-token') accessToken;
  config: ImageSearchConfig = imageSearchConfig;
  driverChallengeInfo$: Observable<SCILLPersonalChallengesInfo>;
  challengeInfo$: Observable<SCILLPersonalChallengesInfo>;
  distribution: number[];
  image$: Observable<ImageInfo>;
  notification$ = new BehaviorSubject<SCILLNotification>(null);
  firstLaunch = true;

  constructor(private scillService: SCILLService, private scillPersonalChallengesService: SCILLPersonalChallengesService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.accessToken && changes.accessToken.currentValue) {
      this.scillService.setAccessToken(changes.accessToken.currentValue);
    }
  }

  ngOnInit(): void {
    // Create an image distribution
    this.distribution = [];
    this.config.distribution.forEach((item, index) => {
      if (index === 0) {
        this.distribution.push(item);
      } else if (index === this.config.distribution.length - 1) {
        this.distribution.push(item);
      } else {
        // Add variation to images in between
        const random = Math.trunc(((Math.random() - 0.5) * 2) * this.config.variance);
        console.log(random);
        this.distribution.push(item + random);
      }
    });

    this.driverChallengeInfo$ = this.scillPersonalChallengesService.getPersonalChallengeInfo(this.appId, this.driverChallengeId);
    this.challengeInfo$ = this.scillPersonalChallengesService.getPersonalChallengeInfo(this.appId, this.challengeId);
    this.image$ = combineLatest([this.driverChallengeInfo$, this.challengeInfo$]).pipe(
      map(([driverChallengeInfo, challengeInfo]) => {
        if (driverChallengeInfo && challengeInfo) {
          console.log(driverChallengeInfo.challenge.user_challenge_current_score, this.distribution, challengeInfo);
          const imageIndex = this.distribution.findIndex((element) => {
            return element === driverChallengeInfo.challenge.user_challenge_current_score;
          });

          console.log(imageIndex, challengeInfo.challenge.user_challenge_current_score);

          // Check if we have found an image that the user did not already find
          if (imageIndex >= challengeInfo.challenge.user_challenge_current_score) {
            // Make sure we have this image available
            if (imageIndex >= 0 && imageIndex < this.config.images.length) {
              return {
                imageUrl: this.config.images[imageIndex],
                top: Math.random() * 400,
                left: Math.random() * 400,
                imageIndex: imageIndex
              };
            }
          }
        }
        return null;
      })
    );

    this.challengeInfo$.subscribe(challengeInfo => {
      if (challengeInfo && challengeInfo.challenge) {
        if (this.firstLaunch) {
          if (challengeInfo.challenge.type === 'in-progress') {
            this.scillService.showNotification(`Wahnsinn! Super gemacht. Echt toll. Du hast schon ${challengeInfo.challenge.user_challenge_current_score} von ${challengeInfo.challenge.challenge_goal} der heutigen Bilder gefunden! Die Chancen stehen gut dass Du heute alle Bilder findest. Surf einfach noch ein bisschen herum!`);
          }
        } else {
          if (challengeInfo.challenge.type === 'in-progress') {
            this.notification$.next(new SCILLNotification(`Wahnsinn! Super gemacht. Echt toll. Du hast schon ${challengeInfo.challenge.user_challenge_current_score} von ${challengeInfo.challenge.challenge_goal} der heutigen Bilder gefunden! Die Chancen stehen gut dass Du heute alle Bilder findest. Surf einfach noch ein bisschen herum!`, null));
            this.sendPoints(challengeInfo.challenge.user_challenge_current_score);
          } else {
            this.notification$.next(new SCILLNotification(`JUCHU! Alle Bilder für heute gefunden! Bis morgen!`, null));
            this.sendPoints(challengeInfo.challenge.user_challenge_current_score);
          }
        }
        this.firstLaunch = false;
      }
    });

    /*
    this.scillService.eventsApi$.subscribe(eventsApi => {
      if (eventsApi) {
        this.simulatePageImpression();
      }
    });
     */
  }

  collectImage(imageInfo: ImageInfo): void {
    this.scillService.sendEvent('collect-item', this.userId, this.userId, {
      item_type: 'image',
      amount: 1
    }).subscribe(result => {
      console.log("Image Collected", result);
    });
  }

  sendPoints(amount: number): void {
    this.scillService.sendEvent('collect-item', this.userId, this.userId, {
      item_type: 'xp',
      amount: amount
    }).subscribe(result => {
      console.log("XP Collected", result);
    });
  }

  simulatePageImpression(): void {
    this.scillService.sendEvent('craft-item', this.userId, this.userId, {
      item_type: 'page-impression',
      amount: 1
    }).subscribe(result => {
      console.log("Page Impression Collected", result);
    });
  }

  closeNotification(): void {
    this.notification$.next(null);
  }
}
