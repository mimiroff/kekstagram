/**
 * upload.js
 * Модуль взаимодействия с формой кадрирования загружаемого изображения
 */
'use strict';
(function () {
  var form = document.querySelector('#upload-select-image');
  var uploadForm = form.querySelector('.upload-image');
  var uploadInput = uploadForm.querySelector('#upload-file');
  var uploadControl = uploadForm.querySelector('.upload-control');
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

  var SCALE_RATIO = 100;
  var pinWidth;

    /**
   * Функция открытия формы кадрирования загружаемого изображения. При открытии попапа закрывает форму загрузки
   * изображения, регистрирует обработчики событий на кнопке закрытия (клик и ENTER),
   * документе (ESC) и кнопке отправки формы клик и ENTER)
   */
  var openFramingForm = function () {
    framingForm.classList.remove('hidden');
    uploadControl.removeEventListener('dragenter', window.util.preventDefaultAction);
    uploadControl.removeEventListener('dragover', window.util.preventDefaultAction);
    uploadControl.removeEventListener('drop', uploadControlDropHandler);
    uploadInput.removeEventListener('change', uploadInputChangeHandler);
    uploadForm.classList.add('hidden');
    document.addEventListener('keydown', documentEscPressHandler);
    uploadCancel.addEventListener('click', uploadCancelClickHandler);
    uploadCancel.addEventListener('keydown', uploadCancelEnterPressHandler);
    uploadSubmit.addEventListener('click', uploadSubmitClickHandler);
    uploadSubmit.addEventListener('keydown', uploadSubmitEnterPressHandler);
    effectControls.addEventListener('click', effectControlsClickHandler);
    effectLevelControls.classList.remove('hidden');
    window.initializeFilters.setCoords(effectLevelLine.getBoundingClientRect().width, 'max');
    pinWidth = effectPin.getBoundingClientRect().width;
    effectLevelControls.classList.add('hidden');
    scaleElement.addEventListener('click', scaleElementClickHandler);
    imagePreview.addEventListener('mousedown', imagePreviewMouseDownHandler);
  };
  /**
   * Функция закрытия формы кадрирования. При закрытии попапа показывает форму загрузки изображения, а также
   * снимает обработчик событий с документа (ESC)
   */
  var closeFramingForm = function () {
    framingForm.classList.add('hidden');
    uploadForm.classList.remove('hidden');
    document.removeEventListener('keydown', documentEscPressHandler);
    uploadCancel.removeEventListener('click', uploadCancelClickHandler);
    uploadCancel.removeEventListener('keydown', uploadCancelEnterPressHandler);
    uploadSubmit.removeEventListener('click', uploadSubmitClickHandler);
    uploadSubmit.removeEventListener('keydown', uploadSubmitEnterPressHandler);
    effectControls.removeEventListener('click', effectControlsClickHandler);
    scaleElement.removeEventListener('click', scaleElementClickHandler);
    imagePreview.removeEventListener('mousedown', imagePreviewMouseDownHandler);
    uploadControl.addEventListener('dragenter', window.util.preventDefaultAction);
    uploadControl.addEventListener('dragover', window.util.preventDefaultAction);
    uploadControl.addEventListener('drop', uploadControlDropHandler);
    uploadInput.addEventListener('change', uploadInputChangeHandler);
    resetUploadForm();
  };
  /**
   * Функция сброса формы
   */
  var resetUploadForm = function () {
    var filterNone = document.querySelector('#upload-effect-none');
    window.initializeFilters.initializeFilters(filterNone, activateEffectFilter);
    window.initializeScale.initializeScale(null, 100, changePictureSize);
    form.reset();
  };

    /**
   * Функция отправки формы кадрирования загружаемого изображения. Перед отправкой проверяет правильность заполнения
   * поля хеш-тегов. Поле хеш-тегов необязательное, может содержать максмимум пять хеш-тегов, разделенных между
   * собой пробелом. Каждый хеш-тег начинается с #, уникален и не превышает 20 символов.
   * @param {Object} evt
   */
  var submitUploadForm = function (evt) {
    window.util.preventDefaultAction(evt);
    hashTagForm.style.borderColor = null;
    hashTagForm.style.borderWidth = null;

    var highlightError = function (node) {
      node.style.borderColor = 'red';
      node.style.borderWidth = '2px';
    };

    if (!hashTagForm.value) {
      window.backend.save(new FormData(form), closeFramingForm, window.util.renderError);
    } else {
      var hashtagValue = hashTagForm.value;
      var hashtagValues = hashtagValue.split([' ']);
      var MAX_HASHTAG_COUNT = 5;
      var mismatchCount = 0;

      for (var i = 0; i < hashtagValues.length; i++) {
        if (hashtagValues.includes(hashtagValues[i], i + 1) || hashtagValues[i].search(/^[#][\w]{1,19}$/) === -1) {
          mismatchCount++;
        }
      }

      if (mismatchCount === 0 && hashtagValues.length <= MAX_HASHTAG_COUNT) {
        window.backend.save(new FormData(form), closeFramingForm, window.util.renderError);
      } else {
        highlightError(hashTagForm);
      }
    }
  };

  /**
   * Функция применения к загружаемому изображению стиля, соответствующего включенному графическому фильтру
   * @param {String} filter
   * @param {Number} coords
   */
  var activateEffectFilter = function (filter, coords) {

    imagePreview.style.filter = filter;

    if (filter !== 'none') {
      setPinCoords(coords);
      effectLevelControls.classList.remove('hidden');
      effectPin.addEventListener('mousedown', effectPinMouseDownHandler);
    } else {
      effectPin.removeEventListener('mousedown', effectPinMouseDownHandler);
      effectLevelControls.classList.add('hidden');
    }
  };
  /**
   * Функция, устанавливающая координаты пину интенсивности графического фильтра
   * @param {Number} coords
   */
  var setPinCoords = function (coords) {
    var pinHalfWidth = pinWidth / 2;
    effectPin.style.left = coords + 'px';
    effectLevel.style.width = (coords - pinHalfWidth) + 'px';
  };
  /**
   * Функция изменения масштаба загружаемого изображения
   * @param {Number} scale
   */
  var changePictureSize = function (scale) {
    pictureSizeField.value = scale + '%';
    imagePreview.style.transform = 'scale(' + (scale / SCALE_RATIO) + ')';
  };

  /**
   * Функция - обработки данных (путь) загружаемого изображения
   * @param {Array} files
   */
  var handleFiles = function (files) {
    imagePreview.file = files[0];

    var reader = new FileReader();
    reader.onload = (function (img) {
      return function (evt) {
        img.src = evt.target.result;
      };
    })(imagePreview);
    reader.readAsDataURL(files[0]);

    openFramingForm();
  };
  /**
   * Функция обработки извлечения данных загружаемого изображения
   * @param {Event} evt
   */
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
   * @param {Event} evt
   */
  var documentEscPressHandler = function (evt) {
    if (commentForm !== document.activeElement) {
      window.util.isEscEvent(evt, closeFramingForm);
    }
  };
  /**
   * Функция обработчика события клика на кнопке формы reset
   */
  var uploadCancelClickHandler = function () {
    closeFramingForm();
  };
  /**
   * Функция обработчика события нажатия ENTER на кнопке формы reset
   * @param {Event} evt
   */
  var uploadCancelEnterPressHandler = function (evt) {
    window.util.isEnterEvent(evt, closeFramingForm());
  };
  /**
   * Функция обработчика события клика на кнопке формы submit
   * @param {Event} evt
   */
  var uploadSubmitClickHandler = function (evt) {
    submitUploadForm(evt);
  };
  /**
   * Функция обработчика события нажатия ENTER на кнопке формы submit
   * @param {Event} evt
   */
  var uploadSubmitEnterPressHandler = function (evt) {
    window.util.isEnterEvent(evt, submitUploadForm);
  };
   /**
   * Функция - обработчик события клика на кнопки изменения масштаба загружаемого изображения
   * @param {Event} evt
   */
  var scaleElementClickHandler = function (evt) {
    var value = +pictureSizeField.value.substring(0, pictureSizeField.value.length - 1);
    var scaleElementValue = null;

    if ([].slice.call(evt.target.classList).indexOf('upload-resize-controls-button-inc') !== -1) {
      scaleElementValue = 'inc';
    } else if ([].slice.call(evt.target.classList).indexOf('upload-resize-controls-button-dec') !== -1) {
      scaleElementValue = 'dec';
    }
    window.initializeScale.initializeScale(scaleElementValue, value, changePictureSize);
  };
   /** Функция - обработчик события (клик) на чекбоксе графического фильтра через делегирование
   * @param {Event} evt
   */
  var effectControlsClickHandler = function (evt) {
    var target = evt.target;
    while (target !== effectControls) {
      if (target.tagName === 'INPUT') {
        window.initializeFilters.initializeFilters(target, activateEffectFilter);
      }
      target = target.parentNode;
    }
  };
  /**
   * Функция - обработчик перетаскивания пина изменения интенсивности применяемого графического фильтра
   * @param {Event} evt
   */
  var effectPinMouseDownHandler = function (evt) {
    evt.preventDefault();
    window.initializeFilters.setCoords(evt.clientX, 'start');

    var framingFormMouseMoveHandler = function (moveEvt) {
      window.initializeFilters.moveFiltersPin(moveEvt, effectPin, activateEffectFilter);
    };

    var documentMouseUpHandler = function (upEvt) {
      upEvt.preventDefault();
      framingForm.removeEventListener('mousemove', framingFormMouseMoveHandler);
      document.removeEventListener('mouseup', documentMouseUpHandler);
    };

    framingForm.addEventListener('mousemove', framingFormMouseMoveHandler);
    document.addEventListener('mouseup', documentMouseUpHandler);
  };
  /**
   * Функция - обработчик перетаскивания изображения
   * @param {Event} evt
   */
  var imagePreviewMouseDownHandler = function (evt) {
    evt.preventDefault();
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };
    uploadFormPreview.style.position = 'relative';

    var documentMouseMoveHandler = function (moveEvt) {
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

    var documentMouseUpHandler = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', documentMouseMoveHandler);
      document.removeEventListener('mouseup', documentMouseUpHandler);
    };

    document.addEventListener('mousemove', documentMouseMoveHandler);
    document.addEventListener('mouseup', documentMouseUpHandler);
  };

  var uploadControlDropHandler = function (evt) {
    upload(evt);
  };

  var uploadInputChangeHandler = function (evt) {
    upload(evt);
  };

  /**
   * Регистрация обрабочика события на input и label загрузки файла
   */
  uploadControl.addEventListener('dragenter', window.util.preventDefaultAction);
  uploadControl.addEventListener('dragover', window.util.preventDefaultAction);
  uploadControl.addEventListener('drop', uploadControlDropHandler);
  uploadInput.addEventListener('change', uploadInputChangeHandler);
})();
