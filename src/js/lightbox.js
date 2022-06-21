import SimpleLightbox from 'simplelightbox';

export default function lightBox() {
  const lightbox = new SimpleLightbox('.gallery a', {
    captions: true,
    overlay: true,
    preloading: true,
    alertErrorMessage:
      'Изображение не найдено, будет загружено следующее изображение',
  });
  return lightBox;
}
