import './styles.scss';
import { fromEvent } from 'rxjs';
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

const gifsData$ = fromFetch(
    // prettier-ignore
    `https://api.giphy.com/v1/gifs/search?q=${DEFAULT_SEARCH}&offset=${DEFAULT_PAGE * DEFAULT_LIMIT}&limit=${DEFAULT_LIMIT}&api_key=${GIPHY_API_KEY}`,
).pipe(
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
