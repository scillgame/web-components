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
import {Challenge} from '@scillgame/scill-js';
import {Overlay, OverlayRef} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import {ImageSearchNotificationComponent} from '../image-search-notification/image-search-notification.component';

export interface ImageSearchConfig {
  images: string[];
}

export interface ImageInfo {
  imageIndex: number;
  imageUrl: string;
}

@Component({
  selector: 'scill-image-search',
  templateUrl: './image-search.component.html',
  styleUrls: ['./image-search.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class ImageSearchComponent implements OnInit, OnChanges, OnDestroy {

  @Input('config-url') configUrl = 'https://cdn.scillgame.com/image-search.json';
  @Input('app-id') appId;
  @Input('user-id') userId;
  @Input('challenge-id') challengeId;
  @Input('driver-challenge-id') driverChallengeId;
  @Input('event-challenge-id') eventChallengeId;
  @Input('access-token') accessToken;
  @Input('minimum-scroll-depth') minimumScrollDepth = '0';
  @Input('display-delay') displayDelay = '0';
  @Input('display-delay-variation') displayDelayVariation = '0';
  @Input('max-image-width') maxImageWidth = '350';
  @Input('random-value') randomValue = '4';
  @Input('random-stretch') randomStretch = '1.0';
  @Input('first-image-always') firstImageAlways = 'true';
  @Input('notification-image-url') notificationImageUrl = null;
  driverChallengeInfo$: Observable<SCILLPersonalChallengesInfo>;
  challengeInfo$: Observable<SCILLPersonalChallengesInfo>;
  challengesInfo$: Observable<SCILLPersonalChallengesInfo>;
  image$: Observable<ImageInfo>;
  notification$ = new BehaviorSubject<SCILLNotification>(null);
  firstLaunch = true;
  scrollPositionReached$ = new BehaviorSubject<boolean>(false);
  delay = 0;
  @ViewChild('imageArea', {static: true}) imageArea: ElementRef;
  refresh$ = new BehaviorSubject<boolean>(false);

  renderer: Renderer2;
  subscriptions = new Subscription();
  imageRef: OverlayRef;
  notificationRef: OverlayRef;

  config$: Observable<ImageSearchConfig>;
  lastRandomValue = -1;
  eventChallengeCounter;

  constructor(private scillService: SCILLService,
              private scillPersonalChallengesService: SCILLPersonalChallengesService,
              rendererFactory: RendererFactory2,
              private componentFactoryResolver: ComponentFactoryResolver,
              private appRef: ApplicationRef,
              private injector: Injector,
              private http: HttpClient,
              private overlay: Overlay) {
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
    if (this.scrollPositionReached$.getValue()) {
      return;
    }

    const verticalOffset = this.getVerticalScrollPosition();
    const scrollDepth = this.minimumScrollDepth ? parseInt(this.minimumScrollDepth, 10) : 0;
    if (verticalOffset >= scrollDepth) {
      this.scrollPositionReached$.next(true);
    }
  }

  showImage(imageInfo): void {
    if (this.imageRef) {
      this.imageRef.detach();
      this.imageRef = null;
    }

    const positionStrategy = this.overlay.position()
      .global()
      .centerHorizontally()
      .centerVertically();

    const overlayRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'scill-overlay-backdrop',
      panelClass: 'scill-overlay-panel',
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy
    });

    const imagePortal = new ComponentPortal(ImageSearchImageComponent);
    const ref = overlayRef.attach(imagePortal);
    ref.instance.imageInfo = imageInfo;
    ref.instance.maxImageWidth = this.maxImageWidth;
    ref.instance.imageClicked.subscribe(info => {
      if (this.imageRef) {
        this.collectImage(info);
        this.imageRef.detach();
        this.imageRef = null;
      }
    });

    this.imageRef = overlayRef;
  }

  showNotification(notification: SCILLNotification): void {
    if (this.notificationRef) {
      this.notificationRef.detach();
      this.notificationRef = null;
    }

    const positionStrategy = this.overlay.position()
      .global()
      .centerHorizontally()
      .centerVertically();

    const overlayRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'scill-overlay-backdrop',
      panelClass: 'scill-overlay-panel',
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy
    });

    const imagePortal = new ComponentPortal(ImageSearchNotificationComponent);
    const ref = overlayRef.attach(imagePortal);
    ref.instance.notification = notification;
    ref.instance.imageUrl = this.notificationImageUrl;
    ref.instance.onClose.subscribe(() => {
      if (this.notificationRef) {
        this.notificationRef.detach();
        this.notificationRef = null;
      }
    });

    this.subscriptions.add(overlayRef.backdropClick().subscribe(() => {
      if (this.notificationRef) {
        this.notificationRef.detach();
        this.notificationRef = null;
      }
    }));

    this.notificationRef = overlayRef;
  }

  collectImage(imageInfo: ImageInfo): void {
    this.scillService.sendEvent('collect-item', this.userId, this.userId, {
      item_type: 'image',
      amount: 1
    }).subscribe(result => {
      console.log('Image Collected', result);
      this.sendPoints(1);
    });

    this.resetPageImpressions();
  }

  resetPageImpressions(): void {
    this.scillService.sendGroupEvent('craft-item', this.userId, this.userId, {
      item_type: 'page-impression',
      amount   : 1
    }).subscribe(result => {
      console.log('Reset Page Impressions', result);
    });
  }

  calculateDetermisticRandomValue(userId: string): number {
    // Calculate a number based on the current day of week and day of month
    const date = new Date();
    const id = parseInt(userId, 10) + date.getDay() + date.getDate() + date.getHours();

    // Take the last number
    let letter = parseInt(id.toString().substr(-1, 1), 10);

    // Number is between 0 and 9, now move to -5 and 4
    letter -= 5;

    // Scale number to be between -2 and 2
    letter *= 0.4;

    return Math.round(letter);
  }

  ngOnInit(): void {
    // Calculate image display delay
    this.delay = parseInt(this.displayDelay, 10) * 1000;
    this.delay += ((Math.random() - 0.5) * 2) * parseInt(this.displayDelayVariation, 10) * 1000;

    // Create an image distribution
    this.updateScrollPositionReached();

    // Load config
    this.config$ = this.http.get(this.configUrl).pipe(
      map(response => {
        return response as ImageSearchConfig;
      })
    );

    this.challengesInfo$ = this.scillPersonalChallengesService.getPersonalChallengesInfo(this.appId);
    this.image$ = combineLatest([this.scrollPositionReached$, this.config$, this.challengesInfo$]).pipe(
      // Delay processing any image stuff until the delay is reached
      delay(this.delay),
      map(([scrollPositionReached, config, challengesInfo]) => {
        console.log('SCILL: Pipeline triggered', scrollPositionReached, config, challengesInfo);
        if (scrollPositionReached && challengesInfo && config) {
          console.log('SCILL: Got challenge info', challengesInfo);

          if (challengesInfo.lastChallengeChanged != null && challengesInfo.lastChallengeChanged.challenge_id !== this.driverChallengeId) {
            console.log('SCILL: We are only interested in page impression events');
            // Image has been collected, do nothing
            return null;
          }

          const imageChallenge = this.challengeId ? challengesInfo.getChallengeById(this.challengeId) : null;
          const driverChallenge = this.driverChallengeId ? challengesInfo.getChallengeById(this.driverChallengeId) : null;

          if (!imageChallenge) {
            console.warn('SCILL: Challenge with ID not found or not set', this.challengeId, challengesInfo);
            return null;
          }

          if (!driverChallenge) {
            console.warn('SCILL: Driver challenge with ID not found or not set', this.driverChallengeId, challengesInfo);
            return null;
          }

          if (imageChallenge.type !== 'in-progress') {
            console.log('SCILL: Nothing to show, challenge not in progress', imageChallenge);
            return null;
          }

          // The image to be shown corresponds to the images found so far.
          const imageIndexToBeShown = imageChallenge.user_challenge_current_score;

          // Calculate the "next" page impression value where we show the image
          const maxRandomValue = Math.round(parseInt(this.randomValue, 10) + (imageIndexToBeShown * parseFloat(this.randomStretch)));

          // Move this value around by a deterministic random value, it must be deterministic so we can validate the data in the backend
          if (this.userId) {
            // Disabled for now as the page impression stretch is too narrow
            // maxRandomValue += this.calculateDetermisticRandomValue(this.userId);
          }

          console.log(`SCILL: Counter (${driverChallenge.user_challenge_current_score}) must be dividable by ${maxRandomValue}`);

          if (driverChallenge.user_challenge_current_score % maxRandomValue !== 0) {
            if (imageIndexToBeShown > 1) {
              return null;
            }
            if (this.firstImageAlways?.toLowerCase() === 'true' && driverChallenge.user_challenge_current_score <= 1 && imageIndexToBeShown <= 0) {
              console.log('SCILL: First image should be always shown');
            } else {
              return null;
            }
          }

          // Make sure we have this image available
          if (imageIndexToBeShown >= 0 && imageIndexToBeShown < config.images.length) {
            console.log(`SCILL: Image with id ${imageIndexToBeShown} ready to be displayed`);
            // Return image info which will be used to show the overlay
            const imageInfo = {
              imageUrl: config.images[imageIndexToBeShown],
              imageIndex: imageIndexToBeShown
            };

            console.log('SCILL: Image is displayed', imageInfo);
            return imageInfo;
          }
        }

        return null;
      })
    );

    this.subscriptions.add(this.challengesInfo$.subscribe(challengesInfo => {
      console.log('SCILL: Challenges Info: ', challengesInfo);
      if (!challengesInfo) {
        return;
      }

      if (!this.eventChallengeCounter) {
        const eventChallenge = this.eventChallengeId ? challengesInfo.getChallengeById(this.eventChallengeId) : null;
        if (eventChallenge) {
          this.eventChallengeCounter = eventChallenge.user_challenge_current_score;
        } else {
          this.eventChallengeCounter = 0;
        }
      }

      if (challengesInfo && challengesInfo.lastChallengeChanged && challengesInfo.lastChallengeChanged.challenge_id === this.challengeId) {
        // We need to add +1 here, because the total goal is incremented later
        this.eventChallengeCounter += 1;
        let eventInfoText = '. ';
        if (this.eventChallengeId) {
          if (this.eventChallengeCounter === 1) {
            eventInfoText = ` und insgesamt ${this.eventChallengeCounter} Bild eingesammelt. `;
          } else {
            eventInfoText = ` und insgesamt ${this.eventChallengeCounter} Bilder eingesammelt. `;
          }
        }

        if (challengesInfo.lastChallengeChanged.user_challenge_current_score === 0) {
          const text = `Glückwunsch! Du hast ${challengesInfo.lastChallengeChanged.user_challenge_current_score} von ${challengesInfo.lastChallengeChanged.challenge_goal} Bilder der heutigen Schatzsuche gefunden${eventInfoText}`;
          this.scillService.showProgressNotification(text, challengesInfo.lastChallengeChanged);
        } else {
          if (challengesInfo.lastChallengeChanged.type === 'in-progress') {
            const text = `Glückwunsch! Du hast ${challengesInfo.lastChallengeChanged.user_challenge_current_score} von ${challengesInfo.lastChallengeChanged.challenge_goal} Bilder der heutigen Schatzsuche gefunden${eventInfoText}`;
            this.notification$.next(new SCILLNotification(text, null, null, null, false, challengesInfo.lastChallengeChanged));
          } else {
            this.notification$.next(new SCILLNotification(`Großartig! Du hast alle Bilder für heute gefunden und dir somit eine Chance auf den Tagespreis erspielt. Sei auch morgen bei der Schatzsuche dabei!`, null));
          }
        }
        this.firstLaunch = false;
      }
    }));

    this.subscriptions.add(this.image$.subscribe(imageInfo => {
      if (imageInfo) {
        console.log('SCILL: show image: ', imageInfo);
        // console.log('SCILL: Image info changed: ', imageInfo);
        this.showImage(imageInfo);
      }
    }));

    this.subscriptions.add(this.notification$.subscribe(notification => {
      if (notification) {
        this.showNotification(notification);
      }
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  sendPoints(amount: number): void {
    this.scillService.sendEvent('collect-item', this.userId, this.userId, {
      item_type: 'xp',
      amount: amount
    }).subscribe(result => {
      console.log('XP Collected', result);
    });
  }

  simulatePageImpression(): void {
    this.scillService.sendEvent('craft-item', this.userId, this.userId, {
      item_type: 'page-impression',
      amount   : 1
    }).subscribe(result => {
      console.log('Page Impression Collected', result);
    });
  }

  closeNotification(): void {
    this.notification$.next(null);
  }
}
