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

var map = document.querySelector('.map');
map.classList.remove('map--faded');

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
mapPins.appendChild(fragment);

var cardTemplate = document.querySelector('#card').content.querySelector('article');
var mainCard = cardTemplate.cloneNode(true);

mainCard.children[0].src = hosts[0].author.avatar;
mainCard.children[2].textContent = hosts[0].offer.title;
mainCard.children[3].textContent = hosts[0].offer.adress;
mainCard.children[4].innerHTML = hosts[0].offer.price + '&#x20bd;<span>/ночь</span>';

if (hosts[0].offer.type === 'flat') {
  mainCard.children[5].textContent = 'Квартира';
} else if (hosts[0].offer.type === 'bungalo') {
  mainCard.children[5].textContent = 'Бунгало';
} else if (hosts[0].offer.type === 'house') {
  mainCard.children[5].textContent = 'Дом';
} else mainCard.children[5].textContent = 'Дворец';

mainCard.children[6].textContent = hosts[0].offer.rooms + ' комнаты для ' + hosts[0].offer.guests + ' гостей';
mainCard.children[7].textContent = 'Заезд после ' + hosts[0].offer.checkin + ', выезд до ' + hosts[0].offer.checkout;

var featuresList = mainCard.children[8];
var newFeaturesArray = [];

for (var i = 0; i < featuresVariants.length; i++) {
  newFeaturesArray[i] = featuresList.children[0];
  featuresList.removeChild(featuresList.children[0]);
}

for (var i = 0; i < (hosts[0].offer.features.length); i++) {
  var feature = hosts[0].offer.features[i];
  for (var j = 0; j < newFeaturesArray.length - 1; j++) {
    var icon = newFeaturesArray[j].classList;
    if (icon[1] === 'popup__feature--' + feature) {
      featuresList.appendChild(newFeaturesArray[j]);
    }
  }
}

mainCard.children[9].textContent = hosts[0].offer.description;

var popupPhotos = mainCard.children[10];
popupPhotos.children[0].src = hosts[0].offer.photos[0];
for (var i = 1; i < (hosts[0].offer.photos.length); i++) {
  var newPhoto = popupPhotos.children[0].cloneNode(true);
  newPhoto.src = hosts[0].offer.photos[i];
  popupPhotos.appendChild(newPhoto);
}

map.insertBefore(mainCard, map.children[1]);
