import {
  ApplicationRef,
  Component, ComponentFactoryResolver, ComponentRef,
  ElementRef, EmbeddedViewRef,
  HostBinding,
  HostListener, Injector,
  Input,
  OnChanges, OnDestroy,
  OnInit, Renderer2, RendererFactory2,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SCILLPersonalChallengesInfo, SCILLPersonalChallengesService} from '../scillpersonal-challenges.service';
import {BehaviorSubject, combineLatest, Observable, of, Subscription} from 'rxjs';
import {delay, distinctUntilChanged, filter, map, mergeMap, withLatestFrom} from 'rxjs/operators';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';
import {SCILLNotification, SCILLService} from '../scill.service';
import {ImageSearchImageComponent} from '../image-search-image/image-search-image.component';

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
  variance: 0
};

@Component({
  selector: 'scill-image-search',
  templateUrl: './image-search.component.html',
  styleUrls: ['./image-search.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class ImageSearchComponent implements OnInit, OnChanges, OnDestroy {

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
  @Input('container-id') containerId;
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

  renderer: Renderer2;
  subscriptions = new Subscription();
  imageRef: ComponentRef<ImageSearchImageComponent>;

  constructor(private scillService: SCILLService,
              private scillPersonalChallengesService: SCILLPersonalChallengesService,
              rendererFactory: RendererFactory2,
              private componentFactoryResolver: ComponentFactoryResolver,
              private appRef: ApplicationRef,
              private injector: Injector) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

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

  showImage(imageInfo): void {
    if (this.imageRef) {
      console.log("SCILL: Removing old image");
      this.imageRef.destroy();
    }

    if (!imageInfo) {
      return;
    }

    console.log("SCILL: Adding image to the DOM in container: ", this.containerId);

    // 1. Setup the image component
    const componentRef = this.componentFactoryResolver
      .resolveComponentFactory(ImageSearchImageComponent)
      .create(this.injector);
    componentRef.instance.imageInfo = imageInfo;
    componentRef.instance.userId = this.userId;
    componentRef.instance.maxImageWidth = this.maxImageWidth;
    this.imageRef = componentRef;

    // 2. Attach component to the appRef so that it's inside the ng component tree
    this.appRef.attachView(componentRef.hostView);

    // 3. Get DOM element from component
    const domElem = (componentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;

    // 4. Change position
    let container = this.imageArea.nativeElement;
    if (this.containerId) {
      container = document.getElementById(this.containerId);
      if (!container) {
        console.error(`SCILL: Container ${this.containerId} not found in page`);
        container = this.imageArea.nativeElement;
      }
    }
    if (!container) {
      container = document.body;
    }
    container.prepend(domElem);
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

    this.subscriptions.add(this.image$.subscribe(imageInfo => {
      console.log("SCILL: Image info changed: ", imageInfo);
      this.showImage(imageInfo);
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
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
