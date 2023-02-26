import playList from './playList.js'

const body =                document.querySelector('body')
const time =                document.querySelector('.time')
const date =                document.querySelector('.date')
const greeting =            document.querySelector('.greeting')
const userName =            document.querySelector('.name')
const changeQuote =         document.querySelector('.change-quote')
const quote =               document.querySelector('.quote')
const author =              document.querySelector('.author')
const slideNext =           document.querySelector('.slide-next')
const slidePrev =           document.querySelector('.slide-prev')
const city =                document.querySelector('.city')
const weatherIcon =         document.querySelector('.weather-icon')
const temperature =         document.querySelector('.temperature')
const weatherDescription =  document.querySelector('.weather-description')
const wind =                document.querySelector('.wind')
const humidity =            document.querySelector('.humidity')
const play =                document.querySelector('.play')
const prevSong =            document.querySelector('.play-prev')
const nextSong =            document.querySelector('.play-next')
const playListContainer =   document.querySelector('.play-list')
const settingsImg =         document.querySelector('.settings-img')
const settings =            document.querySelector('.settings-container')
const language =            document.querySelector('.language')
const images =              document.querySelector('.images')



// Первоначальное состояние / Initial state
const state = {
  city: 'Minsk', // Ekaterinburg
  language: 'en', // ru
  photoSource: 'GitHub', // Unsplash, Flickr
  blocks: ['player', 'weather', 'time', 'date', 'greeting', 'quote']
}



// Проверка скрытых блоков / Checking hidden blocks
state.blocks.forEach(el => {
  if (localStorage.getItem(el) === 'true') {
    let element = document.getElementById(el)
    element.classList.toggle('block-hidden-element')
    document.querySelector(`#hiddenList input[name="${el}"]`).checked = true
  }
})


// Скрыть блоки / Hide Blocks
const hiddenCheckbox = document.querySelectorAll('.hidden-checkbox')
hiddenCheckbox.forEach(el => el.addEventListener('click', hideBlock))

function hideBlock() {
  const element = document.getElementById(`${this.value}`)
  element.classList.toggle('block-hidden-element')
  localStorage.setItem(this.value, this.checked)
}



// Язык в локальном хранилище / Language in local storage
window.addEventListener('beforeunload', () => {
  localStorage.setItem('language', language.value)
})

if (localStorage.getItem('language')) {
  language.value = localStorage.getItem('language')
  state.language = localStorage.getItem('language')
}



// Слайдер в локальном хранилище / Slider in local storage
window.addEventListener('beforeunload', () => {
  localStorage.setItem('images', images.value)
})

if (localStorage.getItem('images')) {
  images.value = localStorage.getItem('images')
  state.photoSource = localStorage.getItem('images')
}



/* Settings */
settingsImg.addEventListener('click', () => {
  settings.classList.toggle('settings-active')
})

language.addEventListener('change', () => {
  state.language = language.value
  showTime()
  getTimeOfDay()
  getWeather()
  getQuotes()
  getLocalStorage()
})

images.addEventListener('change', () => {
  state.photoSource = images.value
  setBg()
})



// Время / Time
function showTime() {
  const today = new Date()
  let currentTime = today.toTimeString()
  time.textContent = currentTime.split(' ')[0]

  let options = {
    day: 'numeric',
    weekday: 'long',
    month: 'long',
  }

  let currentDate = today.toLocaleDateString(state.language, options)
  date.textContent = currentDate
  setTimeout(showTime, 1000)
}
showTime()



// Время суток / Times of Day
function getTimeOfDay() {
  const today = new Date()
  let timeOfDay = ''
  let greetingText = {}
  let hours = today.getHours()

  if (6 <= hours && hours <= 11) {
    greetingText = {
      'ru': 'Доброе утро',
      'en': 'Good morning',
    }
    timeOfDay = 'morning'

  } else if (12 <= hours && hours <= 17) {
    greetingText = {
      'ru': 'Добрый день',
      'en': 'Good afternoon',
    }
    timeOfDay = 'afternoon'

  } else if (18 <= hours && hours <= 23) {
    greetingText = {
      'ru': 'Добрый вечер',
      'en': 'Good evening',
    }
    timeOfDay = 'evening'

  } else {
    greetingText = {
      'ru': 'Доброй ночи',
      'en': 'Good night',
    }
    timeOfDay = 'night'
  }

  greeting.textContent = greetingText[state.language]
  setTimeout(getTimeOfDay, 1000)
  return timeOfDay
}
getTimeOfDay()



// Приветствие / Greetings
function setLocalStorage() {
  localStorage.setItem('name', userName.value)
}
window.addEventListener('beforeunload', setLocalStorage)

function getLocalStorage() {
  if (state.language === 'ru') {
    userName.placeholder = "[Введите имя]"
  } else {
    userName.placeholder = "[Enter name]"
  }

  if (localStorage.getItem('name')) {
    userName.value = localStorage.getItem('name')
  }
}
window.addEventListener('load', getLocalStorage)



// Слайдер изображений / Image Slider
function getRandomNum() {
  return Math.ceil(Math.random() * 20)
}

let randomNum = getRandomNum()

function getSlideNext() {
  if (randomNum === 20) randomNum = 0

  randomNum++

  if (state.photoSource === 'GitHub') setBg()
  else if (state.photoSource === 'Unsplash') getLinkUnsplash()
  else if (state.photoSource === 'Flickr') getLinkFlickr()

  return randomNum
}
slideNext.addEventListener('click', getSlideNext)

function getSlidePrev() {
  if (randomNum === 1) randomNum = 21

  randomNum--

  if (state.photoSource === 'GitHub') setBg()
  else if (state.photoSource === 'Unsplash') getLinkUnsplash()
  else if (state.photoSource === 'Flickr') getLinkFlickr()

  return randomNum
}
slidePrev.addEventListener('click', getSlidePrev)

function setBg() {
  if (state.photoSource === 'GitHub') {
    const timeOfDay = getTimeOfDay()
    const img = new Image()
    let bgNum = String(randomNum).padStart(2, '0')
    img.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg`
    img.addEventListener('load', () => {
      body.style.backgroundImage = `url(${img.src})`
    })
  }
  else if (state.photoSource === 'Unsplash') getLinkUnsplash()
  else if (state.photoSource === 'Flickr') getLinkFlickr()

}
setBg()

function getLinkUnsplash() {
  const timeOfDay = getTimeOfDay()
  const url = `https://api.unsplash.com/photos/random?orientation=landscape&query=${timeOfDay}&client_id=TqFhLBt2qicqrSQsaEmtapczipfTjTlLhJXk-oL4aXw`

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const img = new Image()
      img.src = data.urls.regular
      img.addEventListener('load', () => {
        body.style.backgroundImage = `url(${img.src})`
      })
    })
}

function getLinkFlickr() {
  const timeOfDay = getTimeOfDay()
  const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=60e0a6184a77c896dbba350f339c1488&tags=${timeOfDay}&extras=url_l&format=json&nojsoncallback=1`

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const img = new Image()
      img.src = data.photos.photo[Math.ceil(Math.random() * 100)].url_l
      img.addEventListener('load', () => {
        body.style.backgroundImage = `url(${img.src})`
      })
    })
}



// Погода / Weather
window.addEventListener('beforeunload', () => {
  localStorage.setItem('city', city.value)
})

if (localStorage.getItem('city')) {
  city.value = localStorage.getItem('city')
} else {
  city.value = state.city
}

function getWeather() {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=${state.language}&appid=08f2a575dda978b9c539199e54df03b0&units=metric`

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.cod == 404 || city.value === '') {
        if (state.language === 'ru') {
          city.placeholder = 'Неверный город'
          alert('Город указан неверно')
        } else {
          city.placeholder = 'Wrong city'
          alert('City is incorrect')
        }

        city.value = ''
        weatherIcon.className = ''
        temperature.textContent = ''
        weatherDescription.textContent = ''
        wind.textContent = ''
        humidity.textContent = ''
      } else {
        let valueWindSpeed = {
          'en': `Wind speed: ${Math.round(data.wind.speed)} m/s`,
          'ru': `Скорость ветра: ${Math.round(data.wind.speed)} м/c`,
        }

        let valueHumidity = {
          'en': `Humidity: ${data.main.humidity}%`,
          'ru': `Влажность: ${data.main.humidity}%`,
        }

        weatherIcon.className = 'weather-icon owf'
        weatherIcon.classList.add(`owf-${data.weather[0].id}`)
        temperature.textContent = `${Math.round(data.main.temp)}°C`
        weatherDescription.textContent = data.weather[0].description
        wind.textContent = valueWindSpeed[state.language]
        humidity.textContent = valueHumidity[state.language]
      }
    })
}
city.addEventListener('change', getWeather)
getWeather()



// Цитаты / Quotes
function getQuotes() {
  const url = `assets/json/data-${state.language}.json`

  fetch(url)
    .then(response => response.json())
    .then(data => {
      let quoteNum = Math.round(Math.random() * data.length)
      quote.textContent = data[quoteNum].text
      author.textContent = data[quoteNum].author

      changeQuote.addEventListener('click', function () {
        let quoteNum = Math.round(Math.random() * data.length)
        quote.textContent = data[quoteNum].text
        author.textContent = data[quoteNum].author
      })
    })
}
getQuotes()



// Аудиоплеер / Audio player
const audio = new Audio()
let isPlay = false
let playNum = 0

playList.forEach(song => {
  let li = document.createElement('li')
  li.classList.add('play-item')
  li.textContent = song.title
  playListContainer.append(li)
})

const playItems = document.querySelectorAll('.play-item')
function playAudio() {
  audio.src = playList[playNum].src
  audio.currentTime = playNum
  playItems[playNum].classList.add('item-active')

  if (!isPlay) {
    audio.play()
    isPlay = true
  } else {
    audio.pause()
    isPlay = false
  }
}
play.addEventListener('click', playAudio)

function toggleBtn() {
  if (isPlay) {
    play.classList.add('pause')
  } else {
    play.classList.remove('pause')
  }
}
play.addEventListener('click', toggleBtn)

function playPrev() {
  playItems[playNum].classList.remove('item-active')

  if (playNum === 0) {
    playNum = playList.length
  }

  playNum--
  isPlay = false
  playAudio()
  toggleBtn()
  return playNum
}
prevSong.addEventListener('click', playPrev)

function playNext() {
  playItems[playNum].classList.remove('item-active')

  if (playNum === playList.length - 1) {
    playNum = -1
  }

  playNum++
  isPlay = false
  playAudio()
  toggleBtn()
  return playNum
}
nextSong.addEventListener('click', playNext)



console.log(`1) Часы и календарь +15
✔️ время выводится в 24-часовом формате, например: 21:01:00 +5
✔️ время обновляется каждую секунду - часы идут. Когда меняется одна из цифр, остальные при этом не меняют своё положение на странице (время не дёргается) +5
✔️ выводится день недели, число, месяц, например: "Воскресенье, 16 мая" / "Sunday, May 16" / "Нядзеля, 16 траўня" +5

2) Приветствие +10
✔️ текст приветствия меняется в зависимости от времени суток (утро, день, вечер, ночь) +5
✔️ пользователь может ввести своё имя. При перезагрузке страницы приложения имя пользователя сохраняется, данные о нём хранятся в local storage +5

3) Смена фонового изображения +20
✔️ ссылка на фоновое изображение формируется с учётом времени суток и случайного номера изображения (от 01 до 20) +5
✔️ изображения перелистываются последовательно - после 18 изображения идёт 19 (клик по правой стрелке), перед 18 изображением идёт 17 (клик по левой стрелке) +5
✔️ изображения перелистываются по кругу: после двадцатого изображения идёт первое (клик по правой стрелке), перед 1 изображением идёт 20 (клик по левой стрелке) +5
✔️ при смене слайдов важно обеспечить плавную смену фоновых изображений. Не должно быть состояний, когда пользователь видит частично загрузившееся изображение или страницу без фонового изображения. Плавную смену фоновых изображений не проверяем: 1) при загрузке и перезагрузке страницы 2) при открытой консоли браузера 3) при слишком частых кликах по стрелкам для смены изображения +5

4) Виджет погоды +15
✔️ при перезагрузке страницы приложения указанный пользователем город сохраняется, данные о нём хранятся в local storage +5
✔️ данные о погоде включают в себя: иконку погоды, описание погоды, температуру в °C, скорость ветра в м/с, относительную влажность воздуха в %. Числовые параметры погоды округляются до целых чисел +5
✔️ выводится уведомление об ошибке при вводе некорректных значений, для которых API не возвращает погоду (пустая строка или бессмысленный набор символов) +5

5) Виджет цитата дня +10
✔️ при загрузке страницы приложения отображается рандомная цитата и её автор +5
✔️ при перезагрузке страницы цитата обновляется (заменяется на другую). Есть кнопка, при клике по которой цитата обновляется (заменяется на другую) +5

6) Аудиоплеер +15
✔️ при клике по кнопке Play/Pause проигрывается первый трек из блока play-list, иконка кнопки меняется на Pause +3
✔️ при клике по кнопке Play/Pause во время проигрывания трека, останавливается проигрывание трека, иконка кнопки меняется на Play +3
✔️ треки пролистываются по кругу - после последнего идёт первый (клик по кнопке Play-next), перед первым - последний (клик по кнопке Play-prev) +3
✔️ трек, который в данный момент проигрывается, в блоке Play-list выделяется стилем +3
➖ после окончания проигрывания первого трека, автоматически запускается проигрывание следующего. Треки проигрываются по кругу: после последнего снова проигрывается первый. +3

7) Продвинутый аудиоплеер +20
➖ добавлен прогресс-бар в котором отображается прогресс проигрывания +3
➖ при перемещении ползунка прогресс-бара меняется текущее время воспроизведения трека +3
➖ над прогресс-баром отображается название трека +3
➖ отображается текущее и общее время воспроизведения трека +3
➖ есть кнопка звука при клике по которой можно включить/отключить звук +2
➖ добавлен регулятор громкости, при перемещении ползунка регулятора громкости меняется громкость проигрывания звука +3
➖ можно запустить и остановить проигрывания трека кликом по кнопке Play/Pause рядом с ним в плейлисте +3

8) Перевод приложения на два языка +15
✔️ переводится язык и меняется формат отображения даты +3
✔️ переводится приветствие и placeholder +3
✔️ переводится прогноз погоды в т.ч описание погоды (OpenWeatherMap API предоставляет такую возможность) и город по умолчанию +3
✔️ переводится цитата дня (используйте подходящий для этой цели API, возвращающий цитаты на нужном языке или создайте с этой целью JSON-файл с цитатами на двух языках) +3
✔️ переводятся настройки приложения. При переключении языка приложения в настройках, язык настроек тоже меняется +3

9) Получение фонового изображения от API +10
✔️ в качестве источника изображений может использоваться Unsplash API +5
✔️ в качестве источника изображений может использоваться Flickr API +5

10) Настройки приложения +20
✔️ в настройках приложения можно указать язык приложения (en/ru или en/be) +3
✔️ в настройках приложения можно указать источник получения фото для фонового изображения: коллекция изображений GitHub, Unsplash API, Flickr API +3
➖ если источником получения фото указан API, в настройках приложения можно указать тег/теги, для которых API будет присылает фото +3
✔️ в настройках приложения можно скрыть/отобразить любой из блоков, которые находятся на странице: время, дата, приветствие, цитата дня, прогноз погоды, аудиоплеер, список дел/список ссылок/ваш собственный дополнительный функционал +3
✔️ скрытие и отображение блоков происходит плавно, не влияя на другие элементы, которые находятся на странице, или плавно смещая их +3
✔️ настройки приложения сохраняются при перезагрузке страницы +5

11) Дополнительный функционал на выбор +10
➖ ToDo List - список дел (как в оригинальном приложении) +10
➖ список ссылок (как в оригинальном приложении) +10
➖ свой собственный дополнительный функционал, по сложности аналогичный предложенным +10

Сделано: 30 из 40 заданий
Итого: 124 баллов

P.S. Если не сложно, то поставьте пожалуйста 130 баллов, доделаю два пункта, чтобы дотянуть до этих баллов`)
