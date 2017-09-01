/**
 * upload.js
 * Модуль взаимодействия с формой кадрирования загружаемого изображения
 */
'use strict';
(function () {
  var form = document.querySelector('#upload-select-image');
  var uploadForm = form.querySelector('.upload-image');
  var uploadInput = uploadForm.querySelector('#upload-file');
  var framingForm = form.querySelector('.upload-overlay');
  var uploadCancel = framingForm.querySelector('.upload-form-cancel');
  var uploadSubmit = framingForm.querySelector('.upload-form-submit');
  var commentForm = framingForm.querySelector('.upload-form-description');
  var hashTagForm = framingForm.querySelector('.upload-form-hashtags');
  /**
   * Функция открытия формы кадрирования загружаемого изображения. При открытии попапа закрывает форму загрузки
   * изображения, регистрирует обработчики событий на кнопке закрытия (клик и ENTER),
   * документе (ESC) и кнопке отправки формы клик и ENTER)
   */
  var framingFormOpen = function () {
    framingForm.classList.remove('hidden');
    uploadForm.classList.add('hidden');
    document.addEventListener('keydown', onDocumentEscPress);
    uploadCancel.addEventListener('click', onUploadCancelClick);
    uploadCancel.addEventListener('keydown', onUploadCancelEnterPress);
    uploadSubmit.addEventListener('click', onUploadSubmitClick);
    uploadSubmit.addEventListener('keydown', onUploadSubmitEnterPress);
  };
  /**
   * Функция закрытия формы кадрирования. При закрытии попапа показывает форму загрузки изображения, а также
   * снимает обработчик событий с документа (ESC)
   */
  var framingFormClose = function () {
    framingForm.classList.add('hidden');
    uploadForm.classList.remove('hidden');
    document.removeEventListener('keydown', onDocumentEscPress);
  };
  /**
   * Функция отправки формы кадрирования загружаемого изображения. Перед отправкой проверяет правильность заполнения
   * полей хеш-тегов и комментариев. Поле комментариев является обязательным, минимальное количество символов - 20,
   * максимальное - 100. Поле хеш-тегов необязательное, может содержать максмимум пять хеш-тегов, разделенных между
   * собой пробелом. Каждый хеш-тег начинается с #, уникален и не превышает 20 символов.
   * @param {Object} evt
   */
  var uploadFormSubmit = function (evt) {
    evt.preventDefault();
    commentForm.style.borderColor = null;
    commentForm.style.borderWidth = null;
    hashTagForm.style.borderColor = null;
    hashTagForm.style.borderWidth = null;
    var hashtagValue = hashTagForm.value;
    var hashtagValues = hashtagValue.split([' ']);
    var matchCount = 0;
    for (var i = 0; i < hashtagValues.length; i++) {
      if (hashtagValues.includes(hashtagValues[i], i + 1)) {
        matchCount++;
      }
    }
    if (!commentForm.validity.valid) {
      commentForm.style.borderColor = 'red';
      commentForm.style.borderWidth = '2px';
      if (hashTagForm.validity.patternMismatch) {
        hashTagForm.style.borderColor = 'red';
        hashTagForm.style.borderWidth = '2px';
      } else if (matchCount > 0) {
        hashTagForm.style.borderColor = 'red';
        hashTagForm.style.borderWidth = '2px';
      }
    } else if (hashTagForm.validity.patternMismatch) {
      hashTagForm.style.borderColor = 'red';
      hashTagForm.style.borderWidth = '2px';
    } else if (matchCount > 0) {
      hashTagForm.style.borderColor = 'red';
      hashTagForm.style.borderWidth = '2px';
    } else {
      form.submit();
    }
  };

  /**
   * Функция обработчика события нажатия ESC
   * @param {Object} evt
   */
  var onDocumentEscPress = function (evt) {
    if (commentForm !== document.activeElement) {
      window.util.isEscEvent(evt, framingFormClose);
    }
  };
  /**
   * Функция обработчика события клика на кнопке формы reset
   */
  var onUploadCancelClick = function () {
    framingFormClose();
  };
  /**
   * Функция обработчика события нажатия ENTER на кнопке формы reset
   * @param {Object} evt
   */
  var onUploadCancelEnterPress = function (evt) {
    window.util.isEnterEvent(evt, framingFormClose);
  };
  /**
   * Функция обработчика события клика на кнопке формы submit
   * @param {Object} evt
   */
  var onUploadSubmitClick = function (evt) {
    uploadFormSubmit(evt);
  };
  /**
   * Функция обработчика события нажатия ENTER на кнопке формы submit
   * @param {Object} evt
   */
  var onUploadSubmitEnterPress = function (evt) {
    window.util.isEnterEvent(evt, uploadFormSubmit);
  };
  /**
   * Функция обработчика события изменения значения поля input (загрузка файла)
   */
  var onUploadInputChange = function () {
    framingFormOpen();
  };
  /**
   * Регистрация обрабочика события на поле input (загрузка файла)
   */
  uploadInput.addEventListener('change', onUploadInputChange);
})();
