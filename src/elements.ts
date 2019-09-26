export const elements = {
    search: document.querySelector('input[name=search]'),
    limits: {
        low: document.querySelector('.limit-buttons > button:first-child'),
        mid: document.querySelector('.limit-buttons > button:nth-child(2)'),
        high: document.querySelector('.limit-buttons > button:last-child'),
    },
    pageNum: document.querySelector('.page-num'),
    totalPages: document.querySelector('.total-pages'),
    prevPage: document.querySelector('.prev-page'),
    nextPage: document.querySelector('.next-page'),
    totalResults: document.querySelector('.total-results'),
    gifContainer: document.querySelector('.giphy-container'),
};
