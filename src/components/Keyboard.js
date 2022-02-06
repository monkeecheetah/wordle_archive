import { keyboardLetters, status, letters } from '../constants'
import { useEffect, useCallback } from 'react'

const Keyboard = ({ letterStatuses, addLetter, onEnterPress, onSpacePress, onDeletePress, gameDisabled, colorBlindMode, transportation }) => {
  const getKeyStyle = (letter) => {

    switch (letterStatuses[letter]) {
      case status.green:
        if (colorBlindMode) {
          return 'bg-orange-500 text-gray-50'
        }
        else {
          let bgcolor = '';
          switch (transportation) {
            case 'trikk':
              bgcolor = 'bg-color-trikk';
              break;
            case 'bat':
              bgcolor = 'bg-color-bat';
              break;
            case 'regionbuss':
              bgcolor = 'bg-color-regionbuss';
              break;
            case 'bybuss':
              bgcolor = 'bg-color-bybuss';
              break;
            case 'tbane':
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
          return 'bg-blue-300 text-gray-50'
        }
        else {
          return 'bg-color-half-right text-gray-50'
        }
      case status.gray:
        return 'bg-color-wrong text-gray-50'
      default:
        return 'dark:bg-n-gray text-primary dark:text-primary-dark'
    }
  }

  const onKeyButtonPress = (letter) => {
    letter = letter.toLowerCase()
    window.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: letter,
      })
    )
  }

  const handleKeyDown = useCallback(
    (event) => {
      if (gameDisabled) return

      const letter = event.key.toUpperCase()
      if (letters.includes(letter)) {
        addLetter(letter)
      } else if (letter === 'ENTER') {
        onEnterPress()
        event.preventDefault()
      } else if (letter === 'BACKSPACE') {
        onDeletePress()
      } else if (event.keyCode === 32 || letter === "SPACE_BAR") {
        addLetter(" ")
      }
    },
    [addLetter, onEnterPress, onDeletePress, gameDisabled]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <div className="w-full flex flex-col items-center mb-3 select-none">
      {keyboardLetters.map((row, idx) => (
        <div key={idx} className="w-full flex justify-center my-[5px]">
          {idx === 3 && (
            <button
              onClick={onEnterPress}
              className="h-10 xxs:h-14 w-12 px-1 text-xs font-medium mx-[3.5px] rounded nm-flat-background-sm dark:nm-flat-background-dark-sm text-primary dark:text-primary-dark"
            >
              ENTER
            </button>
          )}
          {row.map((letter) => (
            <button
              onClick={() => onKeyButtonPress(letter)}
              key={letter}
              className="h-10 xxs:h-14 w-[2rem] sm:w-10 mx-[3.5px] text-sm font-medium rounded-[4px] nm-flat-background-sm dark:nm-flat-background-dark-sm"
            >
              <div
                className={`h-full w-full rounded-[3px] flex items-center justify-center ${getKeyStyle(
                  letter
                )}`}
              >
                {letter}
              </div>
            </button>
          ))}
          {idx === 3 && (
            <button
              onClick={() => onKeyButtonPress("SPACE_BAR")}
              className={`h-10 xxs:h-14 w-12 flex items-center justify-center ${getKeyStyle(" ")} nm-flat-background-sm dark:nm-flat-background-dark-sm rounded`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="currentcolor"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M18 9v4H6V9H4v6h16V9z"
                />
              </svg>
            </button>
          )}
          {idx === 3 && (
            <button
              onClick={onDeletePress}
              className="h-10 xxs:h-14 w-12 flex items-center justify-center nm-flat-background-sm dark:nm-flat-background-dark-sm text-primary dark:text-primary-dark mx-[3.5px] text-sm  rounded"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z"
                />
              </svg>
            </button>
          )}
        </div>
      ))}
    </div>
  )
}

export { Keyboard }
