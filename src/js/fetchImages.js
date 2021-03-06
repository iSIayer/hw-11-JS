import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

class FetchImages {
  constructor() {
    this.inputValue = '';
    this.page = 1;
    this.per_page = 40;
    this.total = '';
    this.totalrenderHits = 0;
  }

  async fetchImages() {
    try {
      const response = await axios.get('https://pixabay.com/api/', {
        params: {
          key: '27577989-542c01d54ae3e84008c27bc5b',
          q: this.inputValue,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: true,
          per_page: this.per_page,
          page: this.page,
        },
      });

      if (response.data.hits.length === 0) {
        return Notify.failure(
          'К сожалению, нет изображений, соответствующих вашему поисковому запросу. Пожалуйста, попробуйте еще раз.'
        );
      }

      this.incrementPage();
      this.total = response.data.totalHits;

      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  get query() {
    return this.inputValue;
  }

  set query(newQuery) {
    this.inputValue = newQuery;
  }

  incrementCountHits(newHits) {
    this.totalrenderHits += newHits;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  showParams() {
    return {
      page: this.page,
      per_page: this.per_page,
      total: this.total,
    };
  }
}

export { FetchImages };
