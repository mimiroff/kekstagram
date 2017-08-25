
'use strict';

var generatePhotos = function (quantity) {
  var comments = ['Всё отлично!', 'В целом не плохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убрать палец из кадра. В конце концов это просто непрофессионально',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой недачный момент?'];

  var photos = [];

  var getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  };

  for (var i = 1; i <= quantity; i++) {
    var photo = {
      url: 'photos/' + i + '.jpg',
      likes: getRandomInt(15, 201)
    };
    if (getRandomInt(0, 2) > 0) {
      photo.comments = [comments[getRandomInt(0, comments.length)], comments[getRandomInt(0, comments.length)]];
    } else {
      photo.comments = [comments[getRandomInt(0, comments.length)]];
    }
    photos.push(photo);
  }

  return photos;
};

var generateElements = function (photo) {
  var photoElement = document.querySelector('#picture-template').content.cloneNode(true);
  photoElement.querySelector('img').src = photo.url;
  photoElement.querySelector('.picture-likes').textContent = photo.likes;
  photoElement.querySelector('.picture-comments').textContent = photo.comments.length.toString();

  return photoElement;
};

var showPhotoElements = function (photos) {
  var fragment = document.createDocumentFragment();
  var pictures = document.querySelector('.pictures');
  for (var i = 0; i < photos.length; i++) {
    fragment.appendChild(generateElements(photos[i]));
  }
  pictures.appendChild(fragment);
};

showPhotoElements(generatePhotos(25));

var gallery = document.querySelector('.gallery-overlay');
var pictureList = document.querySelectorAll('.picture');
var galleryClose = gallery.querySelector('.gallery-overlay-close');
var keyCodes = {
  ENTER: 13,
  ESC: 27
};

var closePopup = function () {
  gallery.classList.add('hidden');
};

var openPopup = function (evt) {
  var image = evt.currentTarget.querySelector('img').src;
  var likes = evt.currentTarget.querySelector('.picture-likes').textContent;
  var comments = evt.currentTarget.querySelector('.picture-comments').textContent;

  gallery.classList.remove('hidden');
  gallery.querySelector('.gallery-overlay-image').src = image;
  gallery.querySelector('.likes-count').textContent = likes;
  gallery.querySelector('.comments-count').textContent = comments;

  galleryClose.addEventListener('click', function () {
    closePopup();
  });
  galleryClose.addEventListener('keydown', function (event) {
    if (event.keyCode === keyCodes.ENTER) {
      closePopup();
    }
  });
  document.addEventListener('keydown', function (event) {
    if (event.keyCode === keyCodes.ESC) {
      closePopup();
    }
  });
};

for (var i = 0; i < pictureList.length; i++) {
  pictureList[i].addEventListener('click', function (evt) {
    evt.preventDefault();
    openPopup(evt);
  });

  pictureList[i].addEventListener('keydown', function (evt) {
    evt.preventDefault();
    if (evt.keyCode === keyCodes.ENTER) {
      openPopup(evt);
    }
  });
}
