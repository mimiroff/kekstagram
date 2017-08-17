
'use strict';

var generatePhotos = function (quantity) {
  var COMMENTS = ['Всё отлично!', 'В целом не плохо. Но не всё.',
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
      photo.comments = [COMMENTS[getRandomInt(0, COMMENTS.length)], COMMENTS[getRandomInt(0, COMMENTS.length)]];
    } else {
      photo.comments = [COMMENTS[getRandomInt(0, COMMENTS.length)]];
    }
    photos.push(photo);
  }

  return photos;
};

var generateElements = function (photo) {
  var photoElement = document.querySelector('#picture-template').content.cloneNode(true);
  photoElement.querySelector('img').src = photo.url;
  photoElement.querySelector('.picture-likes').textContent = photo.likes;
  photoElement.querySelector('.picture-comments').textContent = photo.comments;

  return photoElement;
};

var showPhotoElements = function (photos) {
  var fragment = document.createDocumentFragment();
  var pictures = document.querySelector('.pictures');
  for (var i = 0; i < photos.length; i++) {
    fragment.appendChild(generateElements(photos[i]));
  }
  pictures.appendChild(fragment);

  var gallery = document.querySelector('.gallery-overlay');
  gallery.classList.remove('hidden');
  gallery.querySelector('.gallery-overlay-image').src = photos[0].url;
  gallery.querySelector('.likes-count').textContent = photos[0].likes;
  gallery.querySelector('.comments-count').textContent = photos[0].comments;
};

showPhotoElements(generatePhotos(25));
