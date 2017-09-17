/**
 * popup.js
 * Модуль взаимодействия с попапом галереи фотографий. Открытие и закрытие попапа мышью и клавишами клавиатуры
 */
'use strict';

(function () {
  var gallery = document.querySelector('.gallery-overlay');
  var galleryClose = gallery.querySelector('.gallery-overlay-close');
  var pictures;

  /**
   * Функция закрытия попапа
   */
  var closePopup = function () {
    gallery.classList.add('hidden');
    document.removeEventListener('keydown', documentKeydownHandler);
    galleryClose.removeEventListener('click', galleryCloseClickHandler);
    galleryClose.removeEventListener('keydown', galleryCloseKeydownHandler);
  };
  /**
   * Функция открытия попапа
   * @param {Object} evt
   */
  var openPopup = function (evt) {
    gallery.classList.remove('hidden');
    document.addEventListener('keydown', documentKeydownHandler);
    galleryClose.addEventListener('click', galleryCloseClickHandler);
    galleryClose.addEventListener('keydown', galleryCloseKeydownHandler);
    renderPopup(evt);
  };
  /**
   * Функция отрисовки в попапе данных, выбранного элемента
   * @param {Object} evt
   */
  var renderPopup = function (evt) {
    var target = evt.target;
    while (target !== pictures) {
      if (target.tagName === 'A') {
        var image = target.querySelector('img').src;
        var likes = target.querySelector('.picture-likes').textContent;
        var comments = target.querySelector('.picture-comments').textContent;

        gallery.querySelector('.gallery-overlay-image').src = image;
        gallery.querySelector('.likes-count').textContent = likes;
        gallery.querySelector('.comments-count').textContent = comments;
      }
      target = target.parentNode;
    }
  };
  /**
   * Функция-обрабочик события клик на элементе - картинка
   * @param {Object} evt
   */
  var picturesClickHandler = function (evt) {
    evt.preventDefault();
    openPopup(evt);
  };
  /**
   * Функция-обрабочик события нажатия клавиши ENTER на элементе - картинка
   * @param {Object} evt
   */
  var picturesKeydownHandler = function (evt) {
    window.util.isEnterEvent(evt, openPopup);
  };
  /**
   * Функция-обрабочик события клик на кнопке закрытия попапа (крестик)
   */
  var galleryCloseClickHandler = function () {
    closePopup();
  };
  /**
   * Функция-обрабочик события нажатия клавиши ENTER на кнопке закрытия попапа (крестик)
   * @param {Object} evt
   */
  var galleryCloseKeydownHandler = function (evt) {
    window.util.isEnterEvent(evt, closePopup);
  };
  /**
   * Функция-обрабочик события нажатия клавиши ESC
   * @param {Object} evt
   */
  var documentKeydownHandler = function (evt) {
    window.util.isEscEvent(evt, closePopup);
  };
  /**
   * Интерфейс получения данных загруженных на сайт картинок и регистрация на них обработчиков клика и нажатия ENTER
   * @type {{getElementData: Window.popup.getElementData}}
   */

  window.popup = {
    getElementData: function (node) {

      pictures = node;
      pictures.addEventListener('click', picturesClickHandler);
      pictures.addEventListener('keydown', picturesKeydownHandler);
    }
  };
})();
