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

  var scaleElement = framingForm.querySelector('.upload-resize-controls');
  var pictureSizeField = framingForm.querySelector('.upload-resize-controls-value');
  var uploadFormPreview = framingForm.querySelector('.upload-form-preview');
  var imagePreview = uploadFormPreview.querySelector('.effect-image-preview');
  var effectControls = framingForm.querySelector('.upload-effect-controls');
  var effectLevelControls = framingForm.querySelector('.upload-effect-level');
  var effectLevelLine = effectLevelControls.querySelector('.upload-effect-level-line');
  var effectPin = effectLevelLine.querySelector('.upload-effect-level-pin');
  var effectLevel = effectLevelLine.querySelector('.upload-effect-level-val');

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
    effectControls.addEventListener('click', onEffectControlsClick);
    effectLevelControls.classList.remove('hidden');
    window.initializeFilters.setCoords(effectLevelLine.getBoundingClientRect().width, 'max');
    effectLevelControls.classList.add('hidden');
    scaleElement.addEventListener('click', onPictureSizeButtonClick);
    imagePreview.addEventListener('mousedown', onImagePreviewMove);
  };
  /**
   * Функция закрытия формы кадрирования. При закрытии попапа показывает форму загрузки изображения, а также
   * снимает обработчик событий с документа (ESC)
   */
  var framingFormClose = function () {
    framingForm.classList.add('hidden');
    uploadForm.classList.remove('hidden');
    document.removeEventListener('keydown', onDocumentEscPress);
    uploadFormReset();
  };

  var uploadFormReset = function () {
    var filterNone = document.querySelector('#upload-effect-none');
    window.initializeFilters.initializeFilters(filterNone, effectFilterOn);
    window.initializeScale.initializeScale(null, 100, pictureSizeChange);
    form.reset();
  };

    /**
   * Функция отправки формы кадрирования загружаемого изображения. Перед отправкой проверяет правильность заполнения
   * поля хеш-тегов. Поле хеш-тегов необязательное, может содержать максмимум пять хеш-тегов, разделенных между
   * собой пробелом. Каждый хеш-тег начинается с #, уникален и не превышает 20 символов.
   * @param {Object} evt
   */
  var uploadFormSubmit = function (evt) {
    window.util.preventDefaultAction(evt);
    hashTagForm.style.borderColor = null;
    hashTagForm.style.borderWidth = null;

    var errorHighlight = function (node) {
      node.style.borderColor = 'red';
      node.style.borderWidth = '2px';
    };

    if (!hashTagForm.value) {
      window.backend.save(new FormData(form), framingFormClose, window.util.renderError);
    } else {
      var hashtagValue = hashTagForm.value;
      var hashtagValues = hashtagValue.split([' ']);
      var maxHashtagCount = 5;
      var mismatchCount = 0;

      if (hashtagValues.length > maxHashtagCount) {
        mismatchCount++;
      }

      for (var i = 0; i < hashtagValues.length; i++) {
        if (hashtagValues.includes(hashtagValues[i], i + 1) || hashtagValues[i].search(/^[#][\w]{1,19}$/) === -1) {
          mismatchCount++;
        }
      }
      if (mismatchCount > 0) {
        errorHighlight(hashTagForm);
      } else {
        window.backend.save(new FormData(form), framingFormClose, window.util.renderError);
      }
    }
  };

  /**
   * Функция применения к загружаемому изображению стиля, соответствующего включенному графическому фильтру
   * @param {String} filter
   * @param {Number} coords
   */
  var effectFilterOn = function (filter, coords) {

    imagePreview.style.filter = filter;

    if (filter !== 'none') {
      setPinCoords(coords);
      effectLevelControls.classList.remove('hidden');
      effectPin.addEventListener('mousedown', onEffectPinMove);
    } else {
      effectPin.removeEventListener('mousedown', onEffectPinMove);
      effectLevelControls.classList.add('hidden');
    }
  };
  /**
   * Функция, устанавливающая координаты пину интенсивности графического фильтра
   * @param {Number} coords
   */
  var setPinCoords = function (coords) {
    effectPin.style.left = coords + 'px';
    effectLevel.style.width = (coords - 9) + 'px';
  };
  /**
   * Функция изменения масштаба загружаемого изображения
   * @param {Number} scale
   */
  var pictureSizeChange = function (scale) {
    pictureSizeField.value = scale + '%';
    imagePreview.style.transform = 'scale(' + (scale / 100) + ')';
  };

  var handleFiles = function (files) {
    imagePreview.file = files[0];

    var reader = new FileReader();
    reader.onload = (function (img) {
      return function (evt) {
        img.src = evt.target.result;
      };
    })(imagePreview);
    reader.readAsDataURL(files[0]);

    framingFormOpen();
  };

  var upload = function (evt) {
    window.util.preventDefaultAction(evt);
    var files;

    if (evt.dataTransfer) {
      var dt = evt.dataTransfer;
      files = dt.files;
    } else {
      files = evt.target.files;
    }
    handleFiles(files);
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
 /* var onUploadInputChange = function () {
    framingFormOpen();
  };*/
  /**
   * Функция - обработчик события клика на кнопки изменения масштаба загружаемого изображения
   * @param {Object} evt
   */
  var onPictureSizeButtonClick = function (evt) {
    var value = +pictureSizeField.value.substring(0, pictureSizeField.value.length - 1);
    var scaleElementValue = null;
    if (evt.target.className.includes('upload-resize-controls-button-inc')) {
      scaleElementValue = 'inc';
    } else if (evt.target.className.includes('upload-resize-controls-button-dec')) {
      scaleElementValue = 'dec';
    }
    window.initializeScale.initializeScale(scaleElementValue, value, pictureSizeChange);
  };
   /** Функция - обработчик события (клик) на чекбоксе графического фильтра через делегирование
   * @param {Object} evt
   */
  var onEffectControlsClick = function (evt) {
    var target = evt.target;
    while (target !== effectControls) {
      if (target.tagName === 'INPUT') {
        window.initializeFilters.initializeFilters(target, effectFilterOn);
      }
      target = target.parentNode;
    }
  };
  /**
   * Функция - обработчик события клика на пин изменения интенсивности применяемого графического фильтра
   * @param {Object} evt
   */
  var onEffectPinMove = function (evt) {
    evt.preventDefault();
    window.initializeFilters.setCoords(evt.clientX, 'start');

    var onMouseMove = function (moveEvt) {
      window.initializeFilters.filtersPinMove(moveEvt, effectPin, effectFilterOn);
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      framingForm.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    framingForm.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  var onImagePreviewMove = function (evt) {
    evt.preventDefault();
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };
    uploadFormPreview.style.position = 'relative';

    var onMouseMoveImage = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };
      uploadFormPreview.style.top = (uploadFormPreview.offsetTop - shift.y) + 'px';
      uploadFormPreview.style.left = (uploadFormPreview.offsetLeft - shift.x) + 'px';
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMoveImage);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMoveImage);
    document.addEventListener('mouseup', onMouseUp);
  };

  var onUploadControlDrop = function (evt) {
    upload(evt);
  };

  var onUploadInputChange = function (evt) {
    upload(evt);
  };

  /**
   * Регистрация обрабочика события на input и label загрузки файла
   */
  uploadForm.querySelector('.upload-control').addEventListener('dragenter', window.util.preventDefaultAction);
  uploadForm.querySelector('.upload-control').addEventListener('dragover', window.util.preventDefaultAction);
  uploadForm.querySelector('.upload-control').addEventListener('drop', onUploadControlDrop);
  uploadInput.addEventListener('change', onUploadInputChange);
})();
