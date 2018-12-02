var hosts = [];
var titleVariants = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало недалеко от моря', 'Неуютное бунгало по колено в воде'];
var checkTimeVariants = ['12:00', '13:00', '14:00'];
var typeVariants = ['palace', 'flat', 'house', 'bungalo'];
var featuresVariants = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

var randomNumber = function (max, min) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
var randomArray = function (variants) {
  var newArray = [];
  for (var i = 0; i < randomNumber(variants.length, 0); i++) {
    newArray[i] = variants[randomNumber((variants.length - 1), 0)];


    for (var j = 0; j < i; j++) {
      if (newArray[i] === newArray[j]) {
        newArray[i] = '';
        i = i - 1;
      }
    }
  }
  return newArray;
};

for (i = 0; i < 8; i++) {
  var randomX = randomNumber(900, 300);
  var randomY = randomNumber(630, 130);
  var host = {
    author: {
      avatar: 'img/avatars/user0' + (i + 1) + '.png'
    },
    location: {
      x: randomX,
      y: randomY,
    },
    offer: {
      title: titleVariants[i],
      adress: randomX + ',' + randomY,
      price: randomNumber(1000000, 1000),
      type: typeVariants[randomNumber(typeVariants.length - 1, 0)],
      rooms: randomNumber(5, 1),
      guests: randomNumber(10, 1),
      checkin: checkTimeVariants[randomNumber(2, 0)],
      checkout: checkTimeVariants[randomNumber(2, 0)],
      features: randomArray(featuresVariants),
      description: '',
      photos: ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg']
    }

  };
  hosts[i] = host;
}
console.log(hosts);
var map = document.querySelector('.map');

//Отрисовка меток на карте
var mapPins = document.querySelector('.map__pins');
var pinTemplate = document.querySelector('#pin').content.querySelector('button');
var fragment = document.createDocumentFragment();
for (var i = 0; i < 8; i++) {
  var element = pinTemplate.cloneNode(true);
  element.style = 'left:' + (hosts[i].location.x + 25) + 'px; ' + 'top:' + (hosts[i].location.y + 70) + 'px;';
  element.children[0].src = hosts[i].author.avatar;
  element.children[0].alt = hosts[i].offer.title;
  fragment.appendChild(element);
}

//Заполнение карточки выбранной метки

var fillMainCard = function (pinNumber) {

  var oldPopup = document.querySelector('article.popup');
  if (oldPopup) {
    map.removeChild(oldPopup);
  }

  var cardTemplate = document.querySelector('#card').content.querySelector('article');
  var mainCard = cardTemplate.cloneNode(true);

  mainCard.children[0].src = hosts[pinNumber].author.avatar;
  mainCard.children[2].textContent = hosts[pinNumber].offer.title;
  mainCard.children[3].textContent = hosts[pinNumber].offer.adress;
  mainCard.children[4].innerHTML = hosts[pinNumber].offer.price + '&#x20bd;<span>/ночь</span>';

  if (hosts[pinNumber].offer.type === 'flat') {
    mainCard.children[5].textContent = 'Квартира';
  } else if (hosts[pinNumber].offer.type === 'bungalo') {
    mainCard.children[5].textContent = 'Бунгало';
  } else if (hosts[pinNumber].offer.type === 'house') {
    mainCard.children[5].textContent = 'Дом';
  } else mainCard.children[5].textContent = 'Дворец';

  mainCard.children[6].textContent = hosts[pinNumber].offer.rooms + ' комнаты для ' + hosts[pinNumber].offer.guests + ' гостей';
  mainCard.children[7].textContent = 'Заезд после ' + hosts[pinNumber].offer.checkin + ', выезд до ' + hosts[pinNumber].offer.checkout;

  var featuresList = mainCard.children[8];
  var newFeaturesArray = [];
  for (var i = 0; i < featuresVariants.length; i++) {
    newFeaturesArray[i] = featuresList.children[0];
    featuresList.removeChild(featuresList.children[0]);
  }
  for (var i = 0; i < (hosts[pinNumber].offer.features.length); i++) {
    var feature = hosts[pinNumber].offer.features[i];
    for (var j = 0; j < newFeaturesArray.length; j++) {
      var icon = newFeaturesArray[j].classList;
      if (icon[1] === 'popup__feature--' + feature) {
        featuresList.appendChild(newFeaturesArray[j]);
      }
    }
  }

  mainCard.children[9].textContent = hosts[pinNumber].offer.description;

  var popupPhotos = mainCard.children[10];
  popupPhotos.children[0].src = hosts[pinNumber].offer.photos[0];
  for (var i = 1; i < (hosts[pinNumber].offer.photos.length); i++) {
    var newPhoto = popupPhotos.children[0].cloneNode(true);
    newPhoto.src = hosts[pinNumber].offer.photos[i];
    popupPhotos.appendChild(newPhoto);
  }
  map.insertBefore(mainCard, map.children[1]);
};

//Переход в неактивное состояние форм
var noticeFieldsets = document.querySelectorAll('.ad-form>fieldset');
for (var i = 0; i < noticeFieldsets.length; i++) {
  noticeFieldsets[i].disabled = 'disabled';
}
var mapFiltersForm = document.querySelector('.map__filters');
mapFiltersForm.classList.add('map__filters--disabled');
var noticeForm = document.querySelector('.ad-form');



var activeModeOn = function () {
  map.classList.remove('map--faded');
  mapPins.appendChild(fragment);
  mapFiltersForm.classList.remove('map__filters--disabled');
  noticeForm.classList.remove('ad-form--disabled');
  for (var i = 0; i < noticeFieldsets.length; i++) {
    noticeFieldsets[i].disabled = '';
  }
};

//Заполнение поля адрес
var mainIconSize = 65;
var fillAdress = function (iconX, iconY) {
  var adressInput = document.querySelector('#address');
  adressInput.setAttribute('value', Math.round(iconX + mainIconSize / 2) + ',' + Math.round(iconY + mainIconSize / 2));
  adressInput.setAttribute('readonly', 'readonly');
};

//Переход в активное состояние по клику на основную иконку
var onMainPinClick = document.querySelector('.map__pin--main');
onMainPinClick.addEventListener('mouseup', function () {
  activeModeOn();
  fillAdress(570, 375);
});

//Заполнение карточки выбранной метки по клику

mapPins.addEventListener('click', function (event) {
  var target = event.target;
  if (!(target.type === 'button')) {
    target = target.parentElement;
  }
  for (var i = 0; i < mapPins.children.length; i++) {
    if (mapPins.children[i] === target) {
      var childIndex = i;
    }
  }
  if (childIndex === 0 || childIndex === 1) {
    var pinIndex = 0;
  } else pinIndex = childIndex - 2;
  fillMainCard(pinIndex);
});
