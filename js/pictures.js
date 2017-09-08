/**
 * pictures.js
 * Модуль отрисовки элементов (фотографий) на главной странице Кекстограм.
 */
'use strict';

(function () {
  /**
   * Функция изменения порядка отображения фотографий на странице, в зависимости от выбранного фильтра
   * @param {Event} evt
   * @param {Array} data
   */
  var sortPhotos = function (evt, data) {
    var sortedData;

    var updatePhoto = function () {
      showPhotoElements(sortedData);
    };

    switch (evt.target.value) {
      case 'popular':
        sortedData = data.slice().sort(function (left, right) {
          return right.likes - left.likes;
        });
        break;
      case 'discussed':
        sortedData = data.slice().sort((function (left, right) {
          return right.comments.length - left.comments.length;
        }));
        break;
      case 'random':
        sortedData = data.slice().sort(function () {
          return Math.random() - 0.5;
        });
        break;
      case 'recommend':
        sortedData = data;
        break;
    }
    window.util.debounce(updatePhoto);
  };
  /**
   * Функция отрисовки формы фильтрации изображений на странице
   * @param {Object} data
   */
  var showFilter = function (data) {
    var filtersForm = document.querySelector('.filters');
    filtersForm.classList.remove('hidden');
    filtersForm.querySelectorAll('.filters-radio').forEach(function (element) {
      element.addEventListener('click', function (evt) {
        sortPhotos(evt, data);
      });
    });
    showPhotoElements(data);
  };
  /**
   * Функция создания DOM элемента на основе шаблона, с комтентом, составленным из загруженных с сервера данных
   * @param {Object} photo
   * @return {Node}
   */
  var generateElements = function (photo) {
    var photoElement = document.querySelector('#picture-template').content.cloneNode(true);
    photoElement.querySelector('img').src = photo.url;
    photoElement.querySelector('.picture-likes').textContent = photo.likes;
    photoElement.querySelector('.picture-comments').textContent = photo.comments.length.toString();

    return photoElement;
  };
  /**
   * Функция отрисовки сгенерированных DOM элементов на страницу, используя Fragment
   * @param {NodeList} photos
   */
  var showPhotoElements = function (photos) {
    var fragment = document.createDocumentFragment();
    var pictures = document.querySelector('.pictures');

    [].slice.call(photos).forEach(function (it) {
      fragment.appendChild(generateElements(it));
    });
    while (pictures.firstChild) {
      pictures.removeChild(pictures.firstChild);
    }
    pictures.appendChild(fragment);

    window.popup.getElementData(pictures.querySelectorAll('.picture'));
  };
  window.backend.load(showFilter, window.util.renderError);
})();
