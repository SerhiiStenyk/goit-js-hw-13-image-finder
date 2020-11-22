import ImageApiService from './apiService';
import imageCardTpl from '../teplates/image-card.hbs';
import { error } from '@pnotify/core';
import '@pnotify/core/dist/BrightTheme.css';
import "@pnotify/core/dist/PNotify.css";
import * as basicLightbox from 'basiclightbox';
import '../../node_modules/basiclightbox/dist/basicLightbox.min.css'

const imageApiService = new ImageApiService();
const refs = {
    searchForm: document.querySelector('.search-form'),
    gallaryContainer: document.querySelector('.gallery'),
    gate: document.querySelector('#gate'),
    scrollBtn: document.querySelector('.scroll'),
};
refs.searchForm.addEventListener('submit', onSearch);
refs.scrollBtn.addEventListener('click', () => { scrollToTop()});

function onSearch(e) {
    e.preventDefault();
    imageApiService.query = e.currentTarget.elements.query.value;
    if (imageApiService.query === '') {
        error({ text: 'Nothing to search!' });
        clearGallery();
        return
    }
    imageApiService.resetPage();
    imageApiService.fetchImages().then(hits => {
        clearGallery();
        renderImages(hits);
        lightboxOpen();
        e.target.reset();
        scrollToTop();
        refs.scrollBtn.classList.remove('is-open');
    })
};
function scrollToTop() {
    window.scrollTo({
  top: 0,
  left: 0,
  behavior: 'auto'
});
};
function lightboxOpen() {
    refs.gallaryContainer.onclick = (e) => {
        basicLightbox.create(`<img src="${e.target.dataset.source}">`).show()};
};
function renderImages(hits) {
    refs.gallaryContainer.insertAdjacentHTML('beforeend', imageCardTpl(hits));
};
function clearGallery() {
    refs.gallaryContainer.innerHTML = '';
}
const observer = new IntersectionObserver(onEntry, { rootMargin: '300px' });
function onEntry(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting && imageApiService.query !== '') {
            imageApiService.fetchImages().then(renderImages);
            refs.scrollBtn.classList.add('is-open');
        };
    });
};
observer.observe(refs.gate);

