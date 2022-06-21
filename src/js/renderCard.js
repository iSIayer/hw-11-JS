import markup from '../templates/cardImage.hbs';
import refs from './refs';

export default function render(data) {
  const markupElementOfFetch = data.map(elem => markup(elem)).join('');
  return refs.markupCard.insertAdjacentHTML('beforeend', markupElementOfFetch);
}
