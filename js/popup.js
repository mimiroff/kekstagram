/**
 * popup.js
 * Модуль взаимодействия с попапом галереи фотографий. Открытие и закрытие попапа мышью и клавишами клавиатуры
 */
'use strict';

(function () {
  var gallery = document.querySelector('.gallery-overlay');
  var pictureList = document.querySelectorAll('.picture');
  var galleryClose = gallery.querySelector('.gallery-overlay-close');
  /**
   * Функция закрытия попапа
   */
  var closePopup = function () {
    gallery.classList.add('hidden');
    document.removeEventListener('keydown', onDocumentEscPress);
  };
  /**
   * Функция открытия попапа
   * @param {Object} evt
   */
  var openPopup = function (evt) {
    gallery.classList.remove('hidden');
    renderPopup(evt);
    document.addEventListener('keydown', onDocumentEscPress);
  };
  /**
   * Функция отрисовки в попапе данных, выбранного элемента
   * @param {Object} evt
   */
  var renderPopup = function (evt) {
    var image = evt.currentTarget.querySelector('img').src;
    var likes = evt.currentTarget.querySelector('.picture-likes').textContent;
    var comments = evt.currentTarget.querySelector('.picture-comments').textContent;

    gallery.querySelector('.gallery-overlay-image').src = image;
    gallery.querySelector('.likes-count').textContent = likes;
    gallery.querySelector('.comments-count').textContent = comments;
  };
  /**
   * Функция-обрабочик события клик на элементе - картинка
   * @param {Object} evt
   */
  var onPictureClick = function (evt) {
    evt.preventDefault();
    openPopup(evt);
  };
  /**
   * Функция-обрабочик события нажатия клавиши ENTER на элементе - картинка
   * @param {Object} evt
   */
  var onPictureEnterPress = function (evt) {
    window.util.isEnterEvent(evt, openPopup);
    document.addEventListener('keydown', onDocumentEscPress);
  };
  /**
   * Функция-обрабочик события клик на кнопке закрытия попапа (крестик)
   */
  var onGalleryCloseClick = function () {
    closePopup();
  };
  /**
   * Функция-обрабочик события нажатия клавиши ENTER на кнопке закрытия попапа (крестик)
   * @param {Object} evt
   */
  var onGalleryCloseEnterPress = function (evt) {
    window.util.isEnterEvent(evt, closePopup);
  };
  /**
   * Функция-обрабочик события нажатия клавиши ESC
   * @param {Object} evt
   */
  var onDocumentEscPress = function (evt) {
    window.util.isEscEvent(evt, closePopup);
  };
  /**
   * подвешивание обработчиков событий на кнопку закрытия попапа (крестик)
   */
  galleryClose.addEventListener('click', onGalleryCloseClick);
  galleryClose.addEventListener('keydown', onGalleryCloseEnterPress);

  /**
   * подвешивание обработчиков событий на каждую картинку с помощью цикла
   */
  for (var i = 0; i < pictureList.length; i++) {

    pictureList[i].addEventListener('click', onPictureClick);
    pictureList[i].addEventListener('keydown', onPictureEnterPress);
  }
})();
