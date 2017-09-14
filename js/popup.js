/**
 * popup.js
 * Модуль взаимодействия с попапом галереи фотографий. Открытие и закрытие попапа мышью и клавишами клавиатуры
 */
'use strict';

(function () {
  var gallery = document.querySelector('.gallery-overlay');
  var galleryClose = gallery.querySelector('.gallery-overlay-close');

  /**
   * Функция закрытия попапа
   */
  var closePopup = function () {
    gallery.classList.add('hidden');
    document.removeEventListener('keydown', onDocumentEscPress);
    galleryClose.removeEventListener('click', onGalleryCloseClick);
    galleryClose.removeEventListener('keydown', onGalleryCloseEnterPress);
  };
  /**
   * Функция открытия попапа
   * @param {Object} evt
   */
  var openPopup = function (evt) {
    gallery.classList.remove('hidden');
    document.addEventListener('keydown', onDocumentEscPress);
    galleryClose.addEventListener('click', onGalleryCloseClick);
    galleryClose.addEventListener('keydown', onGalleryCloseEnterPress);
    renderPopup(evt);
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
    window.util.preventDefaultAction(evt);
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
   * Интерфейс получения данных загруженных на сайт картинок и регистрация на них обработчиков клика и нажатия ENTER
   * @type {{getElementData: Window.popup.getElementData}}
   */
  window.popup = {
    getElementData: function (nodeList) {
      for (var i = 0; i < nodeList.length; i++) {
        nodeList[i].addEventListener('click', onPictureClick);
        nodeList[i].addEventListener('keydown', onPictureEnterPress);
      }
    }
  };
})();
