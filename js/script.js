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
const playItems =           document.querySelectorAll('.play-item')
const playListContainer =   document.querySelector('.play-list')



// Первоначальное состояние / Initial state
const state = {
  city: 'Минск', // Ekaterinburg
  language: 'ru', // en
  photoSource: 'GitHub', // Unsplash, Flickr
  blocks: ['time', 'date','greeting', 'quote', 'weather', 'audio', 'todolist']
}



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
