import './styles.scss';
import {
    AsyncSubject,
    BehaviorSubject,
    combineLatest,
    fromEvent,
    merge,
    Observable,
    of,
    ReplaySubject,
    Subject,
} from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import {
    catchError,
    debounceTime,
    first,
    map,
    share,
    shareReplay,
    switchMap,
    take,
    tap,
} from 'rxjs/operators';
import { GIPHY_API_KEY } from './constants';
import { elements } from './elements';

const searchTermChange$ = fromEvent(elements.search, 'keyup').pipe(
    map(event => (event.target as HTMLInputElement).value),
);
const limitLowClick$ = fromEvent(elements.limits.low, 'click');
const limitMidClick$ = fromEvent(elements.limits.mid, 'click');
const limitHighClick$ = fromEvent(elements.limits.high, 'click');
const prevPageClick$ = fromEvent(elements.prevPage, 'click');
const nextPageClick$ = fromEvent(elements.nextPage, 'click');

const DEFAULT_SEARCH = 'HI';
const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 0;

const page = new BehaviorSubject(DEFAULT_PAGE);
const p = page.getValue(); // 100

page.subscribe(val => {
    //do something
});

const search$ = new BehaviorSubject(DEFAULT_SEARCH);
const limit$ = new BehaviorSubject(DEFAULT_LIMIT);
const page$ = new BehaviorSubject(DEFAULT_PAGE);
const userPage$ = page$.pipe(map(val => val + 1));
const totalResults$ = new BehaviorSubject(0);
const totalPages$: Observable<number> = combineLatest(
    totalResults$,
    limit$,
).pipe(map(([totalResults, limit]) => Math.ceil(totalResults / limit)));

const changes$ = combineLatest(search$, limit$, page$);

const gifsData$ = changes$.pipe(
    debounceTime(200),
    switchMap(([search, limit, page]) => {
        return fromFetch(
            // prettier-ignore
            `https://api.giphy.com/v1/gifs/search?q=${search}&offset=${limit * page}&limit=${limit}&api_key=${GIPHY_API_KEY}`,
        );
    }),
    // fetch returns a response, and we have to switch to the .json call
    switchMap(response => response.json()),
    tap(res => totalResults$.next(res.pagination.total_count)),
);

// Remove just the gifs data from the response
const gifs$ = gifsData$.pipe(map(data => data.data));

gifs$.subscribe(gifs => {
    // Clear out all gifs
    elements.gifContainer.innerHTML = '';

    // Create new gifs and add to DOM
    gifs.forEach(gif => {
        const img = document.createElement('img');
        img.src = gif.images.fixed_height_small.url;
        elements.gifContainer.appendChild(img);
    });
});

// Wire up DOM to BehaviorSubjects
searchTermChange$.pipe(tap(value => search$.next(value))).subscribe();

search$
    .pipe(tap(val => ((elements.search as HTMLInputElement).value = val)))
    .subscribe();
totalResults$
    .pipe(tap(val => (elements.totalResults.innerHTML = val.toString())))
    .subscribe();
totalPages$.subscribe(pages => (elements.totalPages.innerHTML = pages));
userPage$.subscribe(page => {
    elements.pageNum.innerHTML = page;
});

combineLatest(totalPages$, userPage$).subscribe(([total, userPage]) => {
    elements.prevPage.removeAttribute('disabled');
    elements.nextPage.removeAttribute('disabled');
    if (userPage === 1) {
        elements.prevPage.setAttribute('disabled', 'true');
    }
    if (userPage === total) {
        elements.nextPage.setAttribute('disabled', 'true');
    }
});
merge(limitLowClick$, limitMidClick$, limitHighClick$).subscribe(e => {
    const target = e.target as HTMLButtonElement;
    const value = target.innerHTML;
    limit$.next(parseInt(value, 10));
});
limit$.subscribe(limit => {
    [elements.limits.low, elements.limits.mid, elements.limits.high].forEach(
        button => {
            if (button.innerHTML === `${limit}`) {
                button.setAttribute('disabled', 'true');
            } else {
                button.removeAttribute('disabled');
            }
        },
    );
});
prevPageClick$.subscribe(() => {
    const currentPage = page$.getValue();
    page$.next(currentPage - 1);
});

nextPageClick$.subscribe(() => {
    const currentPage = page$.getValue();
    page$.next(currentPage + 1);
});
