import './styles.scss';
import { BehaviorSubject, combineLatest, fromEvent } from 'rxjs';
import { fromFetch } from 'rxjs/internal/observable/dom/fetch';
import { map, switchMap } from 'rxjs/operators';
import { GIPHY_API_KEY } from './constants';
import { elements } from './elements';

const searchTermChange$ = fromEvent(elements.search, 'keyup');
const limitLowClick$ = fromEvent(elements.limits.low, 'click');
const limitMidClick$ = fromEvent(elements.limits.mid, 'click');
const limitNighClick$ = fromEvent(elements.limits.high, 'click');
const prevPageClick$ = fromEvent(elements.prevPage, 'click');
const nextPageClick$ = fromEvent(elements.nextPage, 'click');

const DEFAULT_SEARCH = 'HI';
const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 0;

const search$ = new BehaviorSubject(DEFAULT_SEARCH);
const limit$ = new BehaviorSubject(DEFAULT_LIMIT);
const page$ = new BehaviorSubject(DEFAULT_PAGE);

// @ts-ignore
window._ = { search$, limit$, page$ };

const params$ = combineLatest(search$, limit$, page$);

const gifsData$ = params$.pipe(
    switchMap(([search, limit, page]) => {
        return fromFetch(
            // prettier-ignore
            `https://api.giphy.com/v1/gifs/search?q=${search}&offset=${page * limit}&limit=${limit}&api_key=${GIPHY_API_KEY}`,
        );
    }),
    // fetch returns a response, and we have to switch to the .json call
    switchMap(response => response.json()),
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
