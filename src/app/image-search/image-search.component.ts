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

export interface ImageSearchConfig {
  images: string[];
}

export interface ImageInfo {
  imageIndex: number;
  imageUrl: string;
  top: number;
  left: number;
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
  @Input('container') containerSelector;
  @Input('min-vertical-offset') minVerticalOffset = '0';
  @Input('max-vertical-offset') maxVerticalOffset = '400';
  @Input('random-value') randomValue = '4';
  @Input('random-stretch') randomStretch = '1.0';
  @Input('first-image-always') firstImageAlways = 'true';
  driverChallengeInfo$: Observable<SCILLPersonalChallengesInfo>;
  challengeInfo$: Observable<SCILLPersonalChallengesInfo>;
  challengesInfo$: Observable<SCILLPersonalChallengesInfo>;
  eventChallenge: Challenge;
  image$: Observable<ImageInfo>;
  notification$ = new BehaviorSubject<SCILLNotification>(null);
  firstLaunch = true;
  scrollPositionReached$ = new BehaviorSubject<boolean>(false);
  delay = 0;
  @ViewChild('imageArea', {static: true}) imageArea: ElementRef;
  refresh$ = new BehaviorSubject<boolean>(false);

  renderer: Renderer2;
  subscriptions = new Subscription();
  imageRef: ComponentRef<ImageSearchImageComponent>;

  config$: Observable<ImageSearchConfig>;
  lastRandomValue = -1;

  constructor(private scillService: SCILLService,
              private scillPersonalChallengesService: SCILLPersonalChallengesService,
              rendererFactory: RendererFactory2,
              private componentFactoryResolver: ComponentFactoryResolver,
              private appRef: ApplicationRef,
              private injector: Injector,
              private http: HttpClient) {
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
    console.log('SHOWING IMAGE INFO: ', imageInfo);
    this.removeImage();

    if (!imageInfo) {
      return;
    }

    console.log('SCILL: Adding image to the DOM in container: ', this.containerSelector);

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
    const container = this.getContainer();
    container.prepend(domElem);
  }

  getContainer(): HTMLElement {
    let container = this.imageArea.nativeElement;
    if (this.containerSelector) {
      container = document.querySelector(this.containerSelector);
      if (!container) {
        console.error(`SCILL: Container ${this.containerSelector} not found in page`);
        container = this.imageArea.nativeElement;
      }
    }
    if (!container) {
      container = document.body;
    }
    return container;
  }

  calculateMaxLeftOffset(): number {
    const container = this.getContainer();
    let maxLeftOffset = container.clientWidth - parseInt(this.maxImageWidth, 10);
    console.log('SCILL: Max left offset and client width', maxLeftOffset, this.imageArea.nativeElement.clientWidth);
    if (maxLeftOffset < 0) {
      maxLeftOffset = 0;
    }
    return maxLeftOffset;
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

          const imageChallenge = this.challengeId ? challengesInfo.getChallengeById(this.challengeId): null;
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

          const maxRandomValue = parseInt(this.randomValue, 10) + (imageIndexToBeShown * parseFloat(this.randomStretch));
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
            // Return a new pipeline that checks if the scroll position is reached and then returns image info
            const verticalRandomScale = parseInt(this.maxVerticalOffset, 10) - parseInt(this.minVerticalOffset, 10);
            const imageInfo = {
              imageUrl: config.images[imageIndexToBeShown],
              top: (Math.random() * verticalRandomScale) + this.getVerticalScrollPosition() + parseInt(this.minVerticalOffset, 10),
              left: Math.random() * this.calculateMaxLeftOffset(),
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
      console.log("CHALLENGES INFO: ", challengesInfo);
      if (!challengesInfo) {
        return;
      }

      if (challengesInfo && challengesInfo.lastChallengeChanged && challengesInfo.lastChallengeChanged.challenge_id === this.challengeId) {
        const eventChallenge = this.eventChallengeId ? challengesInfo.getChallengeById(this.eventChallengeId) : null;
        // We need to add +1 here, because the total goal is incremented later
        const eventInfoText = eventChallenge ? ` und insgesamt ${eventChallenge.user_challenge_current_score + 1} Stück. Für die Teilnahme an der Hauptpreis-Verlosung brauchst du mindestens 10 gesammelte Bilder! ` : '! ';

        if (challengesInfo.lastChallengeChanged.user_challenge_current_score === 0) {
          this.scillService.showProgressNotification(`Wahnsinn! Super gemacht. Echt toll. Du hast schon ${challengesInfo.lastChallengeChanged.user_challenge_current_score} von ${challengesInfo.lastChallengeChanged.challenge_goal} der heutigen Bilder gefunden${eventInfoText} Die Chancen stehen gut dass Du heute alle Bilder findest. Surf einfach noch ein bisschen herum!`, challengesInfo.lastChallengeChanged);
        } else {
          if (challengesInfo.lastChallengeChanged.type === 'in-progress') {
            this.notification$.next(new SCILLNotification(`Wahnsinn! Super gemacht. Echt toll. Du hast schon ${challengesInfo.lastChallengeChanged.user_challenge_current_score} von ${challengesInfo.lastChallengeChanged.challenge_goal} der heutigen Bilder gefunden${eventInfoText}! Die Chancen stehen gut dass Du heute alle Bilder findest. Surf einfach noch ein bisschen herum!`, null, null, null, false, challengesInfo.lastChallengeChanged));
            this.sendPoints(1);
          } else {
            this.notification$.next(new SCILLNotification(`JUCHU! Alle Bilder für heute gefunden! Bis morgen!`, null));
            this.sendPoints(1);
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
      } else {
        this.removeImage();
      }
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  removeImage(): void {
    if (this.imageRef) {
      console.log('SCILL: removing image: ', this.imageRef);
      this.imageRef.destroy();
      this.imageRef = null;
    }
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
