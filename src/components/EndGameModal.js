import Modal from 'react-modal'
import { useEffect, useState } from 'react'
import { status } from '../constants'
import Trikk from '../data/TramIcon.png'
import Bat from '../data/BoatIcon.png'
import Tbane from '../data/MetroIcon.png'
import Buss from '../data/BussIcon.png'


Modal.setAppElement('#root')

export const EndGameModal = ({
  isOpen,
  handleClose,
  styles,
  darkMode,
  gameState,
  state,
  currentStreak,
  longestStreak,
  answer,
  answerRoute,
  answerColor,
  playAgain,
  day,
  currentRow,
  cellStatuses,
}) => {
  const CloseButton = () => {
    return (
      <div className={darkMode ? 'dark' : ''}>
        <button
          type="button"
          className="rounded px-6 py-2 mt-8 text-lg text-gray-50 dark:nm-flat-background-dark hover:nm-inset-background dark:hover:nm-inset-background-dark text-primary dark:text-primary-dark"
          onClick={playAgain}
        >
          Lukk
        </button>
      </div>
    )
  }

  function getOccurrence(array, value) {
    var count = 0
    if (array) {
      for (let i=0; i<array.length; i++) {
        if (array[i] == value) {
          count += 1
        }
      }
    }
    return count
  }

  function getCurrentTransportationIcon(answerColor) {
    switch (answerColor) {
      case '0B91EF':
        return Trikk;
      case '682C88':
        return Bat;
      case '76A300':
        return Buss
      case 'E60000':
        return Buss;
      case 'EC700C':
        return Tbane;
      default:
        return '';
    }
  }

  function getCurrentBackground(answerColor) {
    switch (answerColor) {
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

  
  const gameStateList = JSON.parse(localStorage.getItem('gameStateList'))
  var wins = getOccurrence(gameStateList, 'won')
  var losses = getOccurrence(gameStateList, 'lost')
  var CurrentImage = getCurrentTransportationIcon(answerColor);
  var backgroundColorClass = getCurrentBackground(answerColor);

  const ShareButton = (props) => {
    const [buttonPressed, setButtonPressed] = useState(false)
    useEffect(() => {
      if (buttonPressed !== false) {
        setTimeout(() => setButtonPressed(false), [3000])
      }
    }, [buttonPressed])
    return (
      <button
        type="button"
        className="rounded px-6 py-2 mt-8 text-lg text-gray-50 dark:nm-flat-background-dark hover:nm-inset-background dark:hover:nm-inset-background-dark text-primary dark:text-primary-dark"
        onClick={() => {
          setButtonPressed(true)
          navigator.clipboard.writeText(
            `Ruter Wordle - ${day} ${gameState === state.won ? currentRow: 'X'}/6\n\n` +
              cellStatuses
                .map((row) => {
                  if (row.every((item) => item !== status.unguessed)) {
                    return (
                      row
                        .map((state) => {
                          switch (state) {
                            case status.gray:
                              if (darkMode) {
                                return '⬛'
                              }
                              else {
                                return '⬜'
                              }
                            case status.green:
                              return '🟩'
                            case status.yellow:
                              return '🟨'
                            default:
                              return '  '
                          }
                        })
                        .join('') + '\n'
                    )
                  } else {
                    return ''
                  }
                })
                .join('')
          )
        }}
      >
        {buttonPressed ? 'Kopiert!' : 'Del'}
      </button>
    )
  }
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      style={styles}
      contentLabel="Game End Modal"
    >
      <div  className={`bg-color-${backgroundColorClass} ${darkMode ? 'dark' : ''}`}>
        <div className="h-full flex flex-col items-center justify-center max-w-[300px] mx-auto text-gray-50 dark:text-primary-dark">
            <>
              <img src={CurrentImage} alt="success" height="auto" width="auto" />
              {gameState === state.won && (
                <h1 className=" text-3xl">Hurra!</h1>
              )}
              {gameState === state.lost && (
              <p>Oops!</p>            
              )}
              <p className="text-center mt-3 text-2xl">
                  Ruten var:<br /> <strong>{answer} - {answerRoute}</strong>
              </p>
              <p className="mt-3 text-2xl">
                Won: {wins}
              </p>
              <p className="mt-3 text-2xl">
                Lost: {losses}
              </p>
            </>
          <ShareButton />
          <CloseButton />
        </div>
      </div>
    </Modal>
  )
}
