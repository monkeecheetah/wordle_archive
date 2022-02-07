import { useEffect, useState, useRef } from 'react'
import { letters, status } from './constants'
import { Keyboard } from './components/Keyboard'
import { dataset } from './data/dataset'
import { useLocalStorage } from './hooks/useLocalStorage'
import { ReactComponent as Info } from './data/Info.svg'
import { ReactComponent as Settings } from './data/Settings.svg'
import { ReactComponent as Share } from './data/Share.svg'

import { InfoModal } from './components/InfoModal'
import { SettingsModal } from './components/SettingsModal'
import { EndGameModal } from './components/EndGameModal'

import { Menu } from '@headlessui/react'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const state = {
  playing: 'playing',
  won: 'won',
  lost: 'lost',
}

const getDayAnswer = (day_) => {
  let todaysAnswer = wordle_answers[day_ - 1].route_short_name.toUpperCase();
  const numEmpty = 4 - todaysAnswer.length;
  let blank = "";
  for (let i = 0; i < numEmpty; i++) {
    blank += " ";
  }
  todaysAnswer = `${blank}${todaysAnswer}`;
  return todaysAnswer;
}

const getAnswerRoute = (day_) => {
  let routename = wordle_answers[day_ - 1].route_long_name;
  return routename;
}


const getAnswerColor = (day_) => {
  let routeColor= wordle_answers[day_ - 1].route_color;
  return routeColor;
}

const getTransportation = (day_) => {
  let todaysTransportationColor = wordle_answers[day_ - 1].route_color;
  switch (todaysTransportationColor) {
    case '0B91EF':
      return 'trikk';
    case '682C88':
      return 'bat';
    case '76A300':
      return 'regionbuss'
    case 'E60000':
      return 'bybuss';
    case 'EC700C':
      return 'tbane';
    default:
      return '';
  }
}

// Set the day number of the puzzle to display and show it as the address bar query string

const setDay = newDay => {
  if (newDay < 1 || newDay > og_day) return;
  day = newDay;
  window.history.pushState({}, '', '?' + day);
};

const getDay = (og_day) => {
  const { search } = document.location;
  var url_day = og_day
  if (search) {
    if (isNaN(search.slice(1))) {
      url_day = og_day
    } else {
      url_day = parseInt(search.slice(1), 10);
    }
    if (url_day > og_day || url_day < 1) {
      url_day = og_day
    }
    return url_day
  }
  else {
    return og_day
  }
}

// Visualisere statistikk
// Skifte grafikk til å være mer Ruterish
// Animasjon på reveal. Man tegner opp alle på engang.
// Se på OG_Dato: Fixed, gjort om til en konstant
// Prøve å deploye, se på deling

const wordle_answers = dataset;

var day;
const og_day = 416 // number of days
setDay(getDay(og_day));
var items_list = []
for (var i = 1; i <= og_day; i++) {
  items_list.push(i)
}

function App() {

  const reloadCount = Number(sessionStorage.getItem('reloadCount')) || 0;

  const initialStates = {
    answerRoute: () => getAnswerRoute(day),
    answer: () => getDayAnswer(day),
    answerColor: () => getAnswerColor(day),
    gameState: state.playing,
    board: [
      ['', '', '', ''],
      ['', '', '', ''],
      ['', '', '', ''],
      ['', '', '', ''],
      ['', '', '', ''],
      ['', '', '', ''],
    ],
    cellStatuses: () => Array(6).fill(Array(4).fill(status.unguessed)),
    currentRow: 0,
    currentCol: 0,
    letterStatuses: () => {
      const letterStatuses = {}
      letters.forEach((letter) => {
        letterStatuses[letter] = status.unguessed
      })
      return letterStatuses
    },
    transportation: () => getTransportation(day),
  }

  const [answer, setAnswer] = useState(initialStates.answer)
  const [answerRoute, setAnswerRoute] = useState(initialStates.answerRoute)
  const [answerColor, setAnswerColor] = useState(initialStates.answerColor)
  const [gameState, setGameState] = useState(initialStates.gameState)
  const [gameStateList, setGameStateList] = useLocalStorage('gameStateList', Array(416).fill(initialStates.gameState))
  const [board, setBoard] = useState(initialStates.board)
  const [cellStatuses, setCellStatuses] = useState(initialStates.cellStatuses)
  const [currentRow, setCurrentRow] = useState(initialStates.currentRow)
  const [currentCol, setCurrentCol] = useState(initialStates.currentCol)
  const [letterStatuses, setLetterStatuses] = useState(initialStates.letterStatuses)
  const [submittedInvalidWord, setSubmittedInvalidWord] = useState(false)
  const [currentStreak, setCurrentStreak] = useLocalStorage('current-streak', 0)
  const [longestStreak, setLongestStreak] = useLocalStorage('longest-streak', 0)
  const streakUpdated = useRef(false)
  const [modalIsOpen, setIsOpen] = useState(false)
  const [firstTime, setFirstTime] = useLocalStorage('first-time', true)
  const [infoModalIsOpen, setInfoModalIsOpen] = useState(firstTime)
  const [settingsModalIsOpen, setSettingsModalIsOpen] = useState(false)
  const [transportation, setTransportation] = useState(initialStates.transportation)

  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)
  const handleInfoClose = () => {
    setFirstTime(false)
    setInfoModalIsOpen(false)
  }

  const [darkMode, setDarkMode] = useLocalStorage('dark-mode', false)
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev)
  }

  const [colorBlindMode, setColorblindMode] = useLocalStorage('colorblind-mode', false)
  const toggleColorBlindMode = () => {
    setColorblindMode((prev) => !prev)
  }

  useEffect(() => {
    if (gameState !== state.playing) {
      setTimeout(() => {
        openModal()
      }, 500)
    }
  }, [gameState])

  useEffect(() => {
    if (!streakUpdated.current) {
      if (gameState === state.won) {
        if (currentStreak >= longestStreak) {
          setLongestStreak((prev) => prev + 1)
        }
        setCurrentStreak((prev) => prev + 1)
        streakUpdated.current = true
      } else if (gameState === state.lost) {
        setCurrentStreak(0)
        streakUpdated.current = true
      }
    }
  }, [gameState, currentStreak, longestStreak, setLongestStreak, setCurrentStreak])

  useEffect(() => {
    if (localStorage.getItem('gameStateList') === null) {
      setGameStateList(gameStateList)
    }
  }, [])

  useEffect(() => {
    if (reloadCount < 1) {
      window.location.reload(true);
      sessionStorage.setItem('reloadCount', String(reloadCount + 1));
    } else {
      sessionStorage.removeItem('reloadCount');
    }
  }, [og_day])

  const getCellStyles = (rowNumber, colNumber, letter) => {
    if (rowNumber === currentRow) {
      if (letter) {
        return `nm-inset-background dark:nm-inset-background-dark text-primary dark:text-primary-dark ${submittedInvalidWord ? 'border border-red-800' : ''
          }`
      }
      return 'nm-flat-background dark:nm-flat-background-dark text-primary dark:text-primary-dark'
    }

    switch (cellStatuses[rowNumber][colNumber]) {
      case status.green:
        if (colorBlindMode) {
          return 'nm-inset-orange-500 text-gray-50'
        }
        else {
          let bgcolor = '';
          switch (dataset[day - 1].route_color) {
            case '0B91EF':
              bgcolor = 'bg-color-trikk';
              break;
            case '682C88':
              bgcolor = 'bg-color-bat';
              break;
            case '76A300':
              bgcolor = 'bg-color-regionbuss';
              break;
            case 'E60000':
              bgcolor = 'bg-color-bybuss';
              break;
            case 'EC700C':
              bgcolor = 'bg-color-tbane';
              break;
            default:
              bgcolor = 'bg-color-green';
              break;
          }
          return `${bgcolor} text-gray-50`;
        }
      case status.yellow:
        if (colorBlindMode) {
          return 'nm-inset-blue-300 text-gray-50'
        }
        else {
          return 'bg-color-half-right text-gray-50'
        }
      case status.gray:
        return 'bg-color-wrong text-gray-50'
      default:
        return 'nm-flat-background dark:nm-flat-background-dark text-primary dark:text-primary-dark'
    }
  }

  const addLetter = (letter) => {
    document.activeElement.blur()
    setSubmittedInvalidWord(false)
    setBoard((prev) => {
      if (currentCol > 3) {
        return prev
      }
      const newBoard = [...prev]
      newBoard[currentRow][currentCol] = letter
      return newBoard
    })
    if (currentCol < 4) {
      setCurrentCol((prev) => prev + 1)
    }
  }

  const isValidWord = (word) => {
    if (word.length < 4) return false
    return true;
  }

  const onEnterPress = () => {
    const word = board[currentRow].join('')
    if (!isValidWord(word)) {
      setSubmittedInvalidWord(true)
      return
    }

    if (currentRow === 6) return

    updateCellStatuses(word, currentRow)
    updateLetterStatuses(word)
    setCurrentRow((prev) => prev + 1)
    setCurrentCol(0)
  }

  const onDeletePress = () => {
    setSubmittedInvalidWord(false)
    if (currentCol === 0) return

    setBoard((prev) => {
      const newBoard = [...prev]
      newBoard[currentRow][currentCol - 1] = ''
      return newBoard
    })

    setCurrentCol((prev) => prev - 1)
  }

  const updateCellStatuses = (word, rowNumber) => {
    setCellStatuses((prev) => {
      const newCellStatuses = [...prev]
      newCellStatuses[rowNumber] = [...prev[rowNumber]]
      const wordLength = word.length
      const answerLetters = Array.from(answer)

      for (let i = 0; i < wordLength; i++) {
        if (word[i] === answer[i]) {

          newCellStatuses[rowNumber][i] = status.green
          answerLetters.splice(i, 1)
        } else if (answerLetters.includes(word[i]) && newCellStatuses[rowNumber][i] !== status.green) {
          newCellStatuses[rowNumber][i] = status.yellow
          answerLetters.splice(answerLetters.indexOf(word[i]), 1)
        } else {
          newCellStatuses[rowNumber][i] = status.gray
        }
      }

      return newCellStatuses
    })
  }

  const isRowAllGreen = (row) => {
    return row.every((cell) => cell === status.green)
  }

  // every time cellStatuses updates, check if the game is won or lost
  useEffect(() => {
    const cellStatusesCopy = [...cellStatuses]
    const reversedStatuses = cellStatusesCopy.reverse()
    const lastFilledRow = reversedStatuses.find((r) => {
      return r[0] !== status.unguessed
    })

    if (lastFilledRow && isRowAllGreen(lastFilledRow)) {
      setGameState(state.won)
      var newGameStateList = JSON.parse(localStorage.getItem('gameStateList'))
      newGameStateList[day - 1] = state.won
      localStorage.setItem('gameStateList', JSON.stringify(newGameStateList))
    } else if (currentRow === 6) {
      setGameState(state.lost)
      var newGameStateList = JSON.parse(localStorage.getItem('gameStateList'))
      newGameStateList[day - 1] = state.lost
      localStorage.setItem('gameStateList', JSON.stringify(newGameStateList))
    }
  }, [cellStatuses, currentRow])

  const updateLetterStatuses = (word) => {
    setLetterStatuses((prev) => {
      const newLetterStatuses = { ...prev }
      const wordLength = word.length
      for (let i = 0; i < wordLength; i++) {
        if (newLetterStatuses[word[i]] === status.green) continue

        if (word[i] === answer[i]) {
          newLetterStatuses[word[i]] = status.green
        } else if (answer.includes(word[i])) {
          newLetterStatuses[word[i]] = status.yellow
        } else {
          newLetterStatuses[word[i]] = status.gray
        }
      }
      return newLetterStatuses
    })
  }

  const modalStyles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: darkMode ? 'hsl(231, 16%, 25%)' : 'hsl(231, 16%, 92%)',
    },
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      transform: 'translate(-50%, -50%)',
      height: 'calc(100% - 2rem)',
      width: 'calc(100% - 2rem)',
      backgroundColor: darkMode ? 'hsl(231, 16%, 25%)' : 'hsl(231, 16%, 92%)',
      boxShadow: `${darkMode
          ? '0.2em 0.2em calc(0.2em * 2) #252834, calc(0.2em * -1) calc(0.2em * -1) calc(0.2em * 2) #43475C'
          : '0.2em 0.2em calc(0.2em * 2) #A3A7BD, calc(0.2em * -1) calc(0.2em * -1) calc(0.2em * 2) #FFFFFF'
        }`,
      border: 'none',
      borderRadius: '1rem',
      maxWidth: '475px',
      maxHeight: '650px',
      position: 'relative',
    },
  }

  const play = () => {
    setAnswer(initialStates.answer)
    setAnswerRoute(initialStates.answerRoute)
    setAnswerColor(initialStates.answerColor)
    setTransportation(initialStates.transportation)
    setGameState(initialStates.gameState)
    setBoard(initialStates.board)
    setCellStatuses(initialStates.cellStatuses)
    setCurrentRow(initialStates.currentRow)
    setCurrentCol(initialStates.currentCol)
    setLetterStatuses(initialStates.letterStatuses)
  }
  const playFirst = () => playDay(1)
  const playPrevious = () => playDay(day - 1)
  const playRandom = () => playDay(Math.floor(Math.random() * (og_day - 1)) + 1)
  const playNext = () => playDay(day + 1)
  const playLast = () => playDay(og_day)

  const playDay = (i) => {
    setDay(i)
    play()
  }

  var tempGameStateList = JSON.parse(localStorage.getItem('gameStateList'))
  if (tempGameStateList === null) {
    setGameStateList(gameStateList)
    tempGameStateList = gameStateList
  }
  for (var i = 4; i <= og_day + 3; i++) {
    var textNumber = document.getElementById('headlessui-menu-item-' + i)
    if (textNumber != null) {
      if (tempGameStateList[i - 1] === state.won) {
        textNumber.classList.add('green-text');
      }
      if (tempGameStateList[i - 1] === state.lost) {
        textNumber.classList.add('red-text');
      }
    }
  }

  var header_symbol = (tempGameStateList[day - 1] === 'won') ? ('✔') : ((tempGameStateList[day - 1] === 'lost') ? ('✘') : '')

  var elements = items_list.map(i => {
    return (
      <Menu.Item key={i}>
        {({ active }) =>
        (
          <a onMouseDown={() => playDay(i)} className=
            {
              classNames(active ? 'font-bold text-gray-900' : '', 'block px-4 py-2 text-sm ' + tempGameStateList[i - 1])
            }>{i + ((tempGameStateList[i - 1] === state.won) ? ' ✔' : ((tempGameStateList[i - 1] === state.lost) ? ' ✘' : ''))}
          </a>
        )
        }
      </Menu.Item>
    );
  });

  if (darkMode === true) {
    var html = document.getElementsByTagName('html')[0]; // '0' to assign the first (and only `HTML` tag)
    html.setAttribute('class', 'dark-bg');
  }
  else {
    var html = document.getElementsByTagName('html')[0]; // '0' to assign the first (and only `HTML` tag)
    html.setAttribute('class', 'bg');
  }

  if (window.innerWidth < 600) {
    return (
      <div className={darkMode ? 'dark h-fill' : 'h-fill'}>
        <div className={`flex flex-col justify-between h-fill bg-background dark:bg-background-dark`}>
          <header className="flex items-center py-2 px-3 text-primary dark:text-primary-dark">
            <button type="button" onClick={() => setSettingsModalIsOpen(true)}>
              <Settings />
            </button>
            <h1 className={"flex-1 text-center text-l xxs:text-lg sm:text-3xl tracking-wide font-bold font-og"}>
              Wordler - Ruter Edition ({day}) {header_symbol}
            </h1>
            <button className="mr-2" type="button" onClick={() => setIsOpen(true)}>
              <Share />
            </button>
            <button type="button" onClick={() => setInfoModalIsOpen(true)}>
              <Info />
            </button>
          </header>
          <div className="flex flex-force-center items-center py-3">
            <div className="flex items-center px-2">
              <button
                type="button"
                className="rounded default-btn px-2 py-2 mt-2 w-24 text-sm nm-flat-background dark:nm-flat-background-dark hover:nm-inset-background dark:hover:nm-inset-background-dark text-primary dark:text-primary-dark"
                onClick={playPrevious}>Forrige
              </button>
            </div>
            <div className="flex items-center px-2">
              <button
                type="button"
                className="rounded default-btn px-2 py-2 mt-2 w-24 text-sm nm-flat-background dark:nm-flat-background-dark hover:nm-inset-background dark:hover:nm-inset-background-dark text-primary dark:text-primary-dark"
                onClick={playRandom}>Tilfeldig
              </button>
            </div>
            <div className="flex items-center px-2">
              <button
                type="button"
                className="rounded default-btn px-2 py-2 mt-2 w-24 text-sm nm-flat-background dark:nm-flat-background-dark hover:nm-inset-background dark:hover:nm-inset-background-dark text-primary dark:text-primary-dark"
                onClick={playNext}>Neste
              </button>
            </div>
          </div>
          <div className="flex flex-force-center items-center py-3">
            <div className="flex items-center px-2">
              <button
                type="button"
                className="rounded default-btn px-2 py-2 w-24 text-sm nm-flat-background dark:nm-flat-background-dark hover:nm-inset-background dark:hover:nm-inset-background-dark text-primary dark:text-primary-dark"
                onClick={playFirst}>Første
              </button>
            </div>
            <div className="flex items-center px-2">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="blurthis default-btn rounded px-2 py-2 w-24 text-sm nm-flat-background dark:nm-flat-background-dark hover:nm-inset-background dark:hover:nm-inset-background-dark text-primary dark:text-primary-dark">
                    Velg
                  </Menu.Button>
                </div>
                <Menu.Items className="origin-top-right default-btn absolute right-0 mt-2 w-42 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none overflow-y-scroll h-56">
                  <div className="py-1">
                    {elements}
                  </div>
                </Menu.Items>
              </Menu>
            </div>
            <div className="flex items-center px-2">
              <button
                type="button"
                className="rounded default-btn px-2 py-2 w-24 text-sm nm-flat-background dark:nm-flat-background-dark hover:nm-inset-background dark:hover:nm-inset-background-dark text-primary dark:text-primary-dark"
                onClick={playLast}>Siste
              </button>
            </div>
          </div>
          <div className="flex items-center flex-col py-4">
            <div className="grid grid-cols-4 grid-flow-row gap-4">
              {board.map((row, rowNumber) =>
                row.map((letter, colNumber) => (
                  <span
                    key={colNumber}
                    className={`${getCellStyles(
                      rowNumber,
                      colNumber,
                      letter
                    )} inline-flex items-center font-medium justify-center text-xl w-[14vw] h-[14vw] xs:w-14 xs:h-14 sm:w-20 sm:h-20 rounded`}
                  >
                    {letter}
                  </span>
                ))
              )}
            </div>
          </div>
          <InfoModal
            isOpen={infoModalIsOpen}
            handleClose={handleInfoClose}
            darkMode={darkMode}
            colorBlindMode={colorBlindMode}
            styles={modalStyles}
          />
          <EndGameModal
            isOpen={modalIsOpen}
            handleClose={closeModal}
            styles={modalStyles}
            darkMode={darkMode}
            gameState={gameState}
            state={state}
            currentStreak={currentStreak}
            longestStreak={longestStreak}
            answer={answer}
            answerRoute={answerRoute}
            answerColor={answerColor}
            playAgain={() => {
              closeModal()
              streakUpdated.current = false
            }}
            day={day}
            currentRow={currentRow}
            cellStatuses={cellStatuses}
          />
          <SettingsModal
            isOpen={settingsModalIsOpen}
            handleClose={() => setSettingsModalIsOpen(false)}
            styles={modalStyles}
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
            colorBlindMode={colorBlindMode}
            toggleColorBlindMode={toggleColorBlindMode}
          />
          <Keyboard
            letterStatuses={letterStatuses}
            addLetter={addLetter}
            onEnterPress={onEnterPress}
            onDeletePress={onDeletePress}
            gameDisabled={gameState !== state.playing}
            colorBlindMode={colorBlindMode}
            transportation={transportation}
          />
        </div>
      </div>
    )
  }
  else {
    return (
      <div className={darkMode ? 'dark h-fill' : 'h-fill'}>
        <div className={`flex flex-col justify-between h-fill bg-background dark:bg-background-dark`}>
          <header className="flex items-center py-2 px-3 text-primary dark:text-primary-dark">
            <button type="button" onClick={() => setSettingsModalIsOpen(true)}>
              <Settings />
            </button>
            <h1 className={"flex-1 text-center text-xl xxs:text-2xl -mr-6 sm:text-4xl tracking-wide font-bold font-og"}>
              Wordler - Ruter Edition ({day})   {header_symbol}
            </h1>
            <button className="mr-6" type="button" onClick={() => setIsOpen(true)}>
              <Share />
            </button>
            <button type="button" onClick={() => setInfoModalIsOpen(true)}>
              <Info />
            </button>
          </header>
          <div className="flex flex-force-center items-center py-3">
            <div className="flex items-center px-3">
              <button
                type="button"
                className="rounded default-btn default-btn px-3 py-2 mt-4 w-32 text-lg nm-flat-background dark:nm-flat-background-dark hover:nm-inset-background dark:hover:nm-inset-background-dark text-primary dark:text-primary-dark"
                onClick={playFirst}>Første
              </button>
            </div>
            <div className="flex items-center px-3">
              <button
                type="button"
                className="rounded default-btn px-3 py-2 mt-4 w-32 text-lg nm-flat-background dark:nm-flat-background-dark hover:nm-inset-background dark:hover:nm-inset-background-dark text-primary dark:text-primary-dark"
                onClick={playPrevious}>Forrige
              </button>
            </div>
            <div className="flex items-center px-3">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="blurthis default-btn rounded px-3 py-2 mt-4 w-32 text-lg nm-flat-background dark:nm-flat-background-dark hover:nm-inset-background dark:hover:nm-inset-background-dark text-primary dark:text-primary-dark">
                    Velg
                  </Menu.Button>
                </div>
                <Menu.Items className="origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none overflow-y-scroll h-56">
                  <div className="py-1">
                    <Menu.Item key={i}>
                      {({ active }) =>
                      (
                        <a onMouseDown={() => playRandom()} className=
                          {
                            classNames(active ? 'font-bold text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm')
                          }>Tilfeldig
                        </a>
                      )
                      }
                    </Menu.Item>
                    {elements}
                  </div>
                </Menu.Items>
              </Menu>
            </div>
            <div className="flex items-center px-3">
              <button
                type="button"
                className="rounded default-btn px-3 py-2 mt-4 w-32 text-lg nm-flat-background dark:nm-flat-background-dark hover:nm-inset-background dark:hover:nm-inset-background-dark text-primary dark:text-primary-dark"
                onClick={playNext}>Neste
              </button>
            </div>
            <div className="flex items-center px-3">
              <button
                type="button"
                className="rounded default-btn px-3 py-2 mt-4 w-32 text-lg nm-flat-background dark:nm-flat-background-dark hover:nm-inset-background dark:hover:nm-inset-background-dark text-primary dark:text-primary-dark"
                onClick={playLast}>Forrige
              </button>
            </div>
          </div>
          <div className="flex items-center flex-col py-4">
            <div className="grid grid-cols-4 grid-flow-row gap-4">
              {board.map((row, rowNumber) =>
                row.map((letter, colNumber) => (
                  <span
                    key={colNumber}
                    className={`${getCellStyles(
                      rowNumber,
                      colNumber,
                      letter
                    )} inline-flex items-center font-bold justify-center text-3xl w-[14vw] h-[14vw] xs:w-14 xs:h-14 sm:w-20 sm:h-20 rounded`}
                  >
                    {letter}
                  </span>
                ))
              )}
            </div>
          </div>
          <InfoModal
            isOpen={infoModalIsOpen}
            handleClose={handleInfoClose}
            darkMode={darkMode}
            colorBlindMode={colorBlindMode}
            styles={modalStyles}
          />
          <EndGameModal
            isOpen={modalIsOpen}
            handleClose={closeModal}
            styles={modalStyles}
            darkMode={darkMode}
            gameState={gameState}
            state={state}
            currentStreak={currentStreak}
            longestStreak={longestStreak}
            answer={answer}
            answerRoute={answerRoute}
            answerColor={answerColor}
            playAgain={() => {
              closeModal()
              streakUpdated.current = false
            }}
            day={day}
            currentRow={currentRow}
            cellStatuses={cellStatuses}
          />
          <SettingsModal
            isOpen={settingsModalIsOpen}
            handleClose={() => setSettingsModalIsOpen(false)}
            styles={modalStyles}
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
            colorBlindMode={colorBlindMode}
            toggleColorBlindMode={toggleColorBlindMode}
          />
          <Keyboard
            letterStatuses={letterStatuses}
            addLetter={addLetter}
            onEnterPress={onEnterPress}
            onDeletePress={onDeletePress}
            gameDisabled={gameState !== state.playing}
            colorBlindMode={colorBlindMode}
          />
        </div>
      </div>
    )
  }
}

export default App
