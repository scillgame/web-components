import {
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SCILLPersonalChallengesInfo, SCILLPersonalChallengesService} from '../scillpersonal-challenges.service';
import {BehaviorSubject, combineLatest, Observable, of} from 'rxjs';
import {delay, distinctUntilChanged, filter, map, mergeMap, withLatestFrom} from 'rxjs/operators';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';
import {SCILLNotification, SCILLService} from '../scill.service';

export interface ImageSearchConfig {
  images: string[];
  distribution: number[];
  variance: number;
}

export interface ImageInfo {
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
  distribution: [1, 5, 13, 18],
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
  @Input('minimum-scroll-depth') minimumScrollDepth;
  @Input('display-delay') displayDelay = '0';
  @Input('display-delay-variation') displayDelayVariation = '0';
  @Input('max-image-width') maxImageWidth = '350';
  config: ImageSearchConfig = imageSearchConfig;
  driverChallengeInfo$: Observable<SCILLPersonalChallengesInfo>;
  challengeInfo$: Observable<SCILLPersonalChallengesInfo>;
  distribution: number[];
  image$: Observable<ImageInfo>;
  notification$ = new BehaviorSubject<SCILLNotification>(null);
  firstLaunch = true;
  scrollPositionReached$ = new BehaviorSubject<boolean>(false);
  delay = 0;
  @ViewChild('imageArea', {static: true}) imageArea: ElementRef;

  constructor(private scillService: SCILLService, private scillPersonalChallengesService: SCILLPersonalChallengesService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.accessToken && changes.accessToken.currentValue) {
      console.log('SCILL: Got access token', changes.accessToken.currentValue);
      this.scillService.setAccessToken(changes.accessToken.currentValue);
    }
  }

  // Listen on window scroll events and push if scroll position is reached
  @HostListener('window:scroll', ['$event']) // for window scroll events
  onScroll(event): void {
    this.updateScrollPositionReached();
  }

  private getVerticalScrollPosition(): number {
    return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  }

  private updateScrollPositionReached(): void {
    const verticalOffset = this.getVerticalScrollPosition();
    if (verticalOffset >= parseInt(this.minimumScrollDepth, 10)) {
      this.scrollPositionReached$.next(true);
    }
  }

  ngOnInit(): void {
    // Calculate image display delay
    this.delay = parseInt(this.displayDelay, 10) * 1000;
    this.delay += ((Math.random() - 0.5) * 2) * parseInt(this.displayDelayVariation, 10) * 1000;

    // Create an image distribution
    this.distribution = [];
    this.updateScrollPositionReached();
    this.config.distribution.forEach((item, index) => {
      if (index === 0) {
        this.distribution.push(item);
      } else if (index === this.config.distribution.length - 1) {
        this.distribution.push(item);
      } else {
        // Add variation to images in between
        const random = Math.trunc(((Math.random() - 0.5) * 2) * this.config.variance);
        this.distribution.push(item + random);
      }
    });

    console.log('SCILL: Image distribution calculated', this.distribution);

    this.driverChallengeInfo$ = this.scillPersonalChallengesService.getPersonalChallengeInfo(this.appId, this.driverChallengeId);
    this.challengeInfo$ = this.scillPersonalChallengesService.getPersonalChallengeInfo(this.appId, this.challengeId);
    this.image$ = combineLatest([this.driverChallengeInfo$, this.challengeInfo$]).pipe(
      // Delay processing any image stuff until the delay is reached
      delay(this.delay),
      mergeMap(([driverChallengeInfo, challengeInfo]) => {
        if (driverChallengeInfo && challengeInfo) {
          console.log('SCILL: Got challenge info', driverChallengeInfo, challengeInfo);
          const imageIndex = this.distribution.findIndex((element) => {
            return element === driverChallengeInfo.challenge.user_challenge_current_score;
          });

          console.log(`SCILL: Image Index calculated (current image counter ${challengeInfo.challenge.user_challenge_current_score}: `, imageIndex);

          // Check if we have found an image that the user did not already find
          if (imageIndex >= challengeInfo.challenge.user_challenge_current_score) {
            // Make sure we have this image available
            if (imageIndex >= 0 && imageIndex < this.config.images.length) {
              console.log('SCILL: Image ready to be displayed, waiting for delay and scroll position', imageIndex);
              // Return a new pipeline that checks if the scroll position is reached and then returns image info
              return this.scrollPositionReached$.pipe(
                // Make sure this only fires if scroll position reached value changes
                distinctUntilChanged(),
                map(scrollPositionReached => {
                  if (scrollPositionReached) {
                    let maxLeftOffset = this.imageArea.nativeElement.clientWidth - parseInt(this.maxImageWidth, 10);
                    console.log('SCILL: Max left offset and client width', maxLeftOffset, this.imageArea.nativeElement.clientWidth);
                    if (maxLeftOffset < 0) {
                      maxLeftOffset = 0;
                    }

                    const imageInfo = {
                      imageUrl: this.config.images[imageIndex],
                      top: (Math.random() * 400) + this.getVerticalScrollPosition(),
                      left: Math.random() * maxLeftOffset,
                      imageIndex
                    };

                    console.log('SCILL: Image is displayed', imageInfo);

                    return imageInfo;
                  } else {
                   return null;
                  }
                })
              );
              }
            }
          }
        return of(null);
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
