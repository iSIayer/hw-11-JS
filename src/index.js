import './sass/main.scss';
import { FetchImages } from './js/fetchImages';
import refs from './js/refs';
import render from './js/renderCard';
// Импорт дополнительных библиотек
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import lightBox from './js/lightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const debounce = require('lodash.debounce');
const fetchImage = new FetchImages();
// Вешаем слушателя на элементы
refs.form.addEventListener('submit', onSearchForm);
window.addEventListener('scroll', debounce(onFetchScroll, 200));
refs.arrowTop.addEventListener('click', onScrollUp);

// Выполняем поисковой запрос по нажатию кнопки
function onSearchForm(e) {
  e.preventDefault();
  showLoader();
  fetchImage.query = e.currentTarget.elements.searchQuery.value;
  fetchImage.resetPage();
  if (fetchImage.inputValue === '')
    return alert('Поле ввода не может быть не заполнено!');

  refs.markupCard.innerHTML = '';
  fetchImage.fetchImages().then(data => {
    hideLoader();
    render(data.hits);
    lightBox();
    fetchImage.incrementCountHits(data.hits.length);
    Notify.success(`Отлично! Мы нашли ${data.totalHits} изображений.`);
    document.querySelector('.welcome-text').style.display = 'none';
  });
}
// Активируем появление кнопки возврата наверх
function onFetchScroll() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop >= 100) {
    refs.arrowTop.classList.add('show');
  } else {
    refs.arrowTop.classList.remove('show');
  }

  if (
    scrollTop + clientHeight >= scrollHeight - 5 &&
    hasMoreQuotes(fetchImage.showParams())
  ) {
    showLoader();
    setTimeout(() => {
      fetchImage.fetchImages().then(data => {
        render(data.hits);
        lightBox();
        fetchImage.incrementCountHits(data.hits.length);
        hideLoader();

        if (fetchImage.page * fetchImage.per_page > fetchImage.total) {
          Notify.info('Сожалеем, но вы достигли конца результатов поиска.');
        }
      });
    }, 500);
  }
}
// Параметры запроса на сервер
function hasMoreQuotes({ page, per_page, total }) {
  const startIndex = (page - 1) * per_page + 1;
  return total === 0 || startIndex < total;
}
//Скрытие и показ предзагрузчика изображений
function showLoader() {
  refs.loader.classList.add('show');
}

function hideLoader() {
  refs.loader.classList.remove('show');
}

function onScrollUp(e) {
  e.preventDefault();
  document.body.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
}
