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

  var pictureSizeField = framingForm.querySelector('.upload-resize-controls-value');
  var pictureSizeDecButton = framingForm.querySelector('.upload-resize-controls-button-dec');
  var pictureSizeIncButton = framingForm.querySelector('.upload-resize-controls-button-inc');
  var imagePreview = framingForm.querySelector('.effect-image-preview');
  var effectControls = framingForm.querySelector('.upload-effect-controls');
  var effectLevelControls = framingForm.querySelector('.upload-effect-level');
  var effectLevelLine = effectLevelControls.querySelector('.upload-effect-level-line');
  var effectPin = effectLevelLine.querySelector('.upload-effect-level-pin');
  var effectLevel = effectLevelLine.querySelector('.upload-effect-level-val');

  var effectLevelCoords = null;
  var activeFilter = null;

  var minCoords = 0;
  var maxCoords = null;

  var value = +pictureSizeField.value.substring(0, pictureSizeField.value.length - 1);

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
    maxCoords = effectLevelLine.getBoundingClientRect().width;
    effectLevelControls.classList.add('hidden');
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
   * Функция увеличения масштаба загружаемого изображения
   */
  var pictureSizeFieldInc = function () {
    var maxScale = 100;
    var step = 25;
    if (value < maxScale) {
      value = value + step;
      pictureSizeField.value = value + '%';
      imagePreview.style = 'transform: scale(' + (value / 100) + ')';
    }
  };
  /**
   * Функция уменьшения масштаба загружаемого изображения
   */
  var pictureSizeFieldDec = function () {
    var minScale = 25;
    var step = 25;
    if (value > minScale) {
      value = value - step;
      pictureSizeField.value = value + '%';
      imagePreview.style = 'transform: scale(' + (value / 100) + ')';
    }
  };

  /**
   * Функция приминения графического эффекта к загружаемому изображению
   * @param {Object} node
   */
  var effectFilterOn = function (node) {
    var dftCoords = (maxCoords * 0.2);
    effectLevelCoords = dftCoords;
    activeFilter = node;

    var setDefaultCoords = function () {
      effectPin.style.left = dftCoords + 'px';
      effectLevel.style.width = dftCoords + 'px';
      effectLevelControls.classList.remove('hidden');
    };

    switch (activeFilter.value) {
      case 'chrome':
        setDefaultCoords();
        imagePreview.style.filter = 'grayscale(' + (effectLevelCoords / maxCoords) + ')';
        break;
      case 'sepia':
        setDefaultCoords();
        imagePreview.style.filter = 'sepia(' + (effectLevelCoords / maxCoords) + ')';
        break;
      case 'marvin':
        setDefaultCoords();
        imagePreview.style.filter = 'invert(' + (effectLevelCoords / (maxCoords / 100)) + '%)';
        break;
      case 'phobos':
        setDefaultCoords();
        imagePreview.style.filter = 'blur(' + (effectLevelCoords / (maxCoords / 3)) + 'px)';
        break;
      case 'heat':
        setDefaultCoords();
        imagePreview.style.filter = 'brightness(' + (effectLevelCoords / (maxCoords / 3)) + ')';
        break;
      default: imagePreview.style.filter = 'none';
        effectLevelControls.classList.add('hidden');
        break;
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
   * Регистрация обрабочика события на поле input (загрузка файла)
   */
  uploadInput.addEventListener('change', onUploadInputChange);

  /**
   * Регистрация обработчиков событий на кнопках уменьшения и увеличения масштаба и на
   * чекбоксах графического фильтра
   */
  pictureSizeDecButton.addEventListener('click', onPictureSizeDecButtonClick);
  pictureSizeIncButton.addEventListener('click', onPictureSizeIncButtonClick);
  effectControls.addEventListener('click', onEffectControlsClick);
  effectPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    var startCoords = evt.clientX;

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      var shift = startCoords - moveEvt.clientX;
      startCoords = moveEvt.clientX;

      if (effectPin.offsetLeft > maxCoords) {
        effectLevelCoords = maxCoords;
        effectPin.style.left = effectLevelCoords + 'px';
        effectLevel.style.width = effectLevelCoords + 'px';
      } else if (effectPin.offsetLeft < minCoords) {
        effectLevelCoords = minCoords;
        effectPin.style.left = effectLevelCoords + 'px';
        effectLevel.style.width = effectLevelCoords + 'px';
      } else {
        effectLevelCoords = (effectPin.offsetLeft - shift);
        effectPin.style.left = effectLevelCoords + 'px';
        effectLevel.style.width = effectLevelCoords + 'px';
      }

      switch (activeFilter.value) {
        case 'chrome': imagePreview.style.filter = 'grayscale(' + (effectLevelCoords / maxCoords) + ')';
          break;
        case 'sepia': imagePreview.style.filter = 'sepia(' + (effectLevelCoords / maxCoords) + ')';
          break;
        case 'marvin': imagePreview.style.filter = 'invert(' + (effectLevelCoords / (maxCoords / 100)) + '%)';
          break;
        case 'phobos': imagePreview.style.filter = 'blur(' + (effectLevelCoords / (maxCoords / 3)) + 'px)';
          break;
        case 'heat': imagePreview.style.filter = 'brightness(' + (effectLevelCoords / (maxCoords / 3)) + ')';
          break;
        default:
          break;
      }
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      framingForm.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    framingForm.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
})();
