const body =        document.querySelector('body')
const time =        document.querySelector('.time')
const date =        document.querySelector('.date')
const greeting =    document.querySelector('.greeting')
const userName =    document.querySelector('.name')
const changeQuote = document.querySelector('.change-quote')
const quote =       document.querySelector('.quote')
const author =      document.querySelector('.author')
const slideNext =   document.querySelector('.slide-next')
const slidePrev =   document.querySelector('.slide-prev')

// Первоначальное состояние / Initial state
const state = {
  language: 'ru', // en
  photoSource: 'GitHub',
  blocks: ['time', 'date','greeting', 'quote', 'weather', 'audio', 'todolist']
}

// Вызов функции / Function call
showTime()
getTimeOfDay()
getQuotes()

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

// Приветствие / Greetings
function setLocalStorage() {
  localStorage.setItem('name', userName.value)
}
window.addEventListener('beforeunload', setLocalStorage)

function getLocalStorage() {
  if (state.language == 'ru') {
    userName.placeholder = "[Введите имя]"
  } else {
    userName.placeholder = "[Enter name]"
  }

  if (localStorage.getItem('name')) {
    userName.value = localStorage.getItem('name')
  }
}
window.addEventListener('load', getLocalStorage)

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
