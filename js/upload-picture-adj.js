/**
 * upload-picture-adj.js
 * Модуль применения к загружаемому изображению масштаба и эффектов
 */
'use strict';

(function () {
  var pictureSizeField = document.querySelector('.upload-resize-controls-value');
  var pictureSizeDecButton = document.querySelector('.upload-resize-controls-button-dec');
  var pictureSizeIncButton = document.querySelector('.upload-resize-controls-button-inc');
  var imagePreview = document.querySelector('.effect-image-preview');
  var effectControls = document.querySelector('.upload-effect-controls');
  var value = +pictureSizeField.value.substring(0, pictureSizeField.value.length - 1);
  /**
   * Функция увеличения масштаба загружаемого изображения
   */
  var pictureSizeFieldInc = function () {
    if (value < 100) {
      value = value + 25;
      pictureSizeField.value = value + '%';
      imagePreview.style = 'transform: scale(' + (value / 100) + ')';
    }
  };
  /**
   * Функция уменьшения масштаба загружаемого изображения
   */
  var pictureSizeFieldDec = function () {
    if (value > 25) {
      value = value - 25;
      pictureSizeField.value = value + '%';
      imagePreview.style = 'transform: scale(' + (value / 100) + ')';
    }
  };
  /**
   * Функция приминения графического эффекта к загружаемому изображению
   * @param {Object} node
   */
  var effectFilterOn = function (node) {
    if (imagePreview.classList.length > 1) {
      imagePreview.classList.remove(imagePreview.classList[1]);
    }
    imagePreview.classList.add('effect-' + node.value);
  };
  /**
   * Функция - обработчик события (клик) на кнопке увеличения масштаба изображения
   */
  var onPictureSizeIncButtonClick = function () {
    pictureSizeFieldInc();
  };
  /**
   * Функция - обработчик события (клик) на кнопке уменьшения масштаба изображения
   */
  var onPictureSizeDecButtonClick = function () {
    pictureSizeFieldDec();
  };
  /**
   * Функция - обработчик события (клик) на чекбоксе графического фильтра через делегирование
   * @param {Object} evt
   */
  var onEffectControlsClick = function (evt) {
    var target = evt.target;
    while (target !== effectControls) {
      if (target.tagName === 'INPUT') {
        effectFilterOn(target);
      }
      target = target.parentNode;
    }
  };
  /**
   * Регистрация обработчиков событий на кнопках уменьшения и увеличения масштаба и на
   * чекбоксах графического фильтра
   */
  pictureSizeDecButton.addEventListener('click', onPictureSizeDecButtonClick);
  pictureSizeIncButton.addEventListener('click', onPictureSizeIncButtonClick);
  effectControls.addEventListener('click', onEffectControlsClick);
})();
