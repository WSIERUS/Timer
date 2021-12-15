const title = document.querySelector('.title') // Pobranie tytułu

const btn = document.getElementById('start') // Pobranie przycisku

const hours = document.querySelector('#hours') // Pobranie wyświetlanej godziny
const minutes = document.querySelector('#minutes') // Pobranie wyświetlanej minuty
const seconds = document.querySelector('#seconds') // Pobranie wyświetlanej sekundy

let hour = 0 // Godzina
let minute = 0 // Minuta
let second = 0 // Sekunda

let mode24 = true // Tryb wyświetlania do 23h 59m 59s w przypadku budzika
let started = false // Czy aplikacja działą
let variable = 'stopwatch' // Wariant zegara / Budzik/Minutnik/Stoper

let date = [new Date().getHours(), new Date().getMinutes(), new Date().getSeconds()] // Aktualna data wejścia na stronę
let audio = new Audio('audio.mp3') // Alarm

btn.addEventListener('click', function (event) { // Obsługa przycisku Start/Stop
  if (started === false) {
    btn.textContent = 'Stop'
    handleStart()
  } else if (started === true) {
    btn.textContent = 'Start'
    handleStart()
  }
  render()
})

document.querySelector('#reset').addEventListener('click', () => reset()) // Obsluga przycisku Reset

document.querySelector('#plushour').addEventListener('click', function () {  //Obsługa dodania godziny do zegara
  if(started === false && (variable === 'timer' || variable === 'alarm')){
    if (hour < 23 && mode24 === true) hour++
    else if (mode24 === false) hour++
    else if (hour > 23) hour = 23
    else if (hour === 23) hour = 0
    render()
  }
})

document.querySelector('#minushour').addEventListener('click', function () { //Obsługa odjęcia godziny od zegara
  if(started === false && (variable === 'timer' || variable === 'alarm')){
    if (hour > 0) hour--
    else if (hour < 0) hour = 0
    else if (hour === 0 && mode24 === true) hour = 23
    else {null}
    render()
  }
})

document.querySelector('#plusminute').addEventListener('click', function () { //Obsługa dodania minuty do zegara
  if(started === false && (variable === 'timer' || variable === 'alarm')){
    if (minute < 59) minute++
    else if (minute > 0) minute = 0
    render()
  }
})

document.querySelector('#minusminute').addEventListener('click', function () { //Obsługa odjęcia minuty od zegara
  if(started === false && (variable === 'timer' || variable === 'alarm')){
    if (minute > 0) minute--
    else if (minute < 0) minute = 0
    else if (minute === 0) minute = 59
    render()
  }
})

document.querySelector('#plussecond').addEventListener('click', function () { //Obsługa dodania sekundy do zegara
  if(started === false && (variable === 'timer' || variable === 'alarm')){
    if (second < 59) second++
    else if (second > 0) second = 0
    render()
  }
})

document.querySelector('#minussecond').addEventListener('click', function () { //Obsługa odjęcia sekundy od zegara
  if(started === false && (variable === 'timer' || variable === 'alarm')){
    if (second > 0) second--
    else if (second < 0) second = 0
    else if (second === 0) second = 59
    render()
  }
})

document.querySelector('#timer').addEventListener('click', function() { // Obsługa włączenia wariantu Minutnik
  started = false
  variable = 'timer'
  title.textContent = 'Minutnik'
  mode24 = false
  reset()
})

document.querySelector('#alarm').addEventListener('click', function() { // Obsługa włączenia wariantu Budzik
  started = false
  variable = 'alarm'
  title.textContent = 'Budzik'
  mode24 = true
  reset()
  date = [new Date().getHours(), new Date().getMinutes(), new Date().getSeconds()]
  hour = date[0]
  minute = date[1] + 1
  render()
})

document.querySelector('#stopwatch').addEventListener('click', function() { // Obsług włączenia wariantu Stoper
  started = false
  variable ='stopwatch'
  title.textContent = 'Stoper'
  mode24 = false
  reset()
})


function render(e) { // Wyświetlanie formatu godziny
  if (mode24 === true) {
    if (hour <= 23) {
      if (hour < 10) {
        hours.textContent = hour.toString().padStart(2, 0)
      } else {
        hours.textContent = hour.toString()
      }
    } else alert('błąd formatu godzin')
  } else if (mode24 === false) {
    if (hour < 10) {
      hours.textContent = hour.toString().padStart(2, 0)
    } else {
      hours.textContent = hour.toString()
    }
  }

  if (minute <= 59) {
    if (minute < 10) {
      minutes.textContent = minute.toString().padStart(2, 0)
    } else {
      minutes.textContent = minute.toString()
    }
  } else alert('błąd formatu minut')

  if (second <= 59) {
    if (second < 10) {
      seconds.textContent = second.toString().padStart(2, 0)
    } else {
      seconds.textContent = second.toString()
    }
  } else alert('błąd formatu sekund')
}

function reset() { // Reset
  hour = 0
  minute = 0
  second = 0
  render()
  clearInterval(interval)
  btn.textContent = 'Start'
  started = false
}

function handleStart() { // Funkcja startu aplikacji
  if (started === false) {
    started = true
    interval = setInterval(checkTime, 1000)
  } else if (started === true) {
    started = false
    reset()
  }
}

function checkTime() { // Kontrola czasu oraz poprawnego zachowania aplikacji do każdego wariantu
  if(variable === 'stopwatch') {
    second++

    if (second === 60) {
      second = 0
      minute++
    }
    if (minute === 60) {
      minute = 0
      hour++
    }
  }

  if(variable === 'timer') {

    if(hour === 0 && minute === 0 && second === 0 && started === true) {
      audio.play()
      setTimeout(function(){
        audio.pause();
        audio.currentTime = 0;
        reset()
      }, 5000)
    }

    if(hour === 0 && minute === 0 && second === 0){
      started = false
      btn.textContent = 'Start'
      clearInterval(interval)
    }

    else {
      second --

      if (second < 0) {
        second = 59
        minute --
      }
      if (minute < 0) {
        minute = 59
        hour --
      }
    }
  }

  if(variable === 'alarm') {
    date = [new Date().getHours(), new Date().getMinutes(), new Date().getSeconds()]
    if(date[0] === hour && date[1] === minute && date[2] === second){
      clearInterval(interval)
      audio.play()
      setTimeout(function(){
        audio.pause();
        audio.currentTime = 0;
        clearInterval(interval)
        btn.textContent = 'Start'
        started = false
      }, 5000)
    }
  }

  render()
}

render()

handleStart() // Debbug
reset()

// opisy funkcji