import { ReactComponent as Github } from '../data/Github.svg'
import { ReactComponent as Close } from '../data/Close.svg'
import Modal from 'react-modal'

Modal.setAppElement('#root')

export const InfoModal = ({ isOpen, handleClose, darkMode, colorBlindMode, styles }) => (
  <Modal isOpen={isOpen} onRequestClose={handleClose} style={styles} contentLabel="Game Info Modal">
    <div className={`${darkMode ? 'dark' : ''}`}>
      <button
        className="absolute top-4 right-4 rounded-full nm-flat-background dark:nm-flat-background-dark text-primary dark:text-primary-dark p-1 w-6 h-6 sm:p-2 sm:h-8 sm:w-8"
        onClick={handleClose}
      >
        <Close />
      </button>
      <div className="h-full flex flex-col items-center justify-center max-w-[390px] mx-auto pt-9 text-primary dark:text-primary-dark">
        <div className="flex-1 w-full sm:text-base text-sm">
          <h1 className="text-center sm:text-3xl text-2xl">Hva er dette?</h1>
          <ul className="list-disc pl-5 block sm:text-base text-sm">
            <li className="mt-6 mb-2">Dette er en klone av <a href="https://www.powerlanguage.co.uk/wordle/">Wordle</a> som erutviklet fra <a href="https://twitter.com/katherinecodes">Katherine Peterson</a>'s <a href="https://octokatherine.github.io/word-master">WordMaster</a>. Denne versjonen er en fork av <a href="https://github.com/DevangThakkar/wordle_archive">Devang Thakkar Wordle Archive</a></li>
          </ul>
          <ul className="list-disc pl-5 block sm:text-base text-sm">
            <li className="mt-6 mb-2">Laget med blod og svette av <a href="https://www.twitter.com/monkeecheetah">Kristoffer J</a>.</li>
            <li className="mb-2">Etter en idé av <a href="https://www.twitter.com/mariayawa">Maria Yawa</a>.</li>
          </ul>
          <h1 className="text-center sm:text-3xl text-2xl">Hvordan spille?</h1>
          <ul className="list-disc pl-5 block sm:text-base text-sm">
            <li className="mt-6 mb-2">Du har 6 gjetting for å gjette riktig rute.</li>
            <li className="mb-2">Du kan gjette hva som helst som en gjetting, inkludert mellomrom! Men kun av tilgjengelige tegn.</li>
            <li className="mb-2">{
              `Etter hver gjetting, vil bokstavene bytte farge til ${colorBlindMode ? 'oransje, blå eller grå.' : 'blå, grønn, lilla, rød, oransje, svart eller grå.'}`
            }
            </li>
          </ul>
          <div className={`mt-8 ${colorBlindMode ? 'show' : 'hide'}`}>
            <div className={`mb-3 flex items-center`}>
              <span className={`nm-inset-orange-500 text-gray-50 inline-flex items-center justify-center text-3x w-10 h-10 rounded-full`}>
                W
              </span>
              <span className="mx-2">=</span>
              <span>Correct letter, correct spot</span>
            </div>
            <div className="mb-3">
              <span className={`nm-inset-blue-300 text-gray-50 inline-flex items-center justify-center text-3x w-10 h-10 rounded-full`}>
                W
              </span>
              <span className="mx-2">=</span>
              <span>Correct letter, wrong spot</span>
            </div>
            <span className="nm-inset-n-gray text-gray-50 inline-flex items-center justify-center text-3x w-10 h-10 rounded-full">
              W
            </span>
            <span className="mx-2">=</span>
            <span>Wrong letter</span>
          </div>
          <div className={`mt-8 ${colorBlindMode ? "hide" : "show"}`}>
            <div className="mb-3">
              <span className={`p-1 bg-color-regionbuss text-gray-50 inline-flex items-center justify-center text-3x w-10 h-10 rounded-full`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M11.625 22.812a2.188 2.188 0 1 1-2.188-2.188 2.188 2.188 0 0 1 2.188 2.188zM29.429 10H2.572a.574.574 0 0 0-.572.573v11.228a.575.575 0 0 0 .572.573h3.347a3.543 3.543 0 0 1 7.037 0h6.088a3.543 3.543 0 0 1 7.037 0h3.348a.575.575 0 0 0 .571-.573V10.574a.574.574 0 0 0-.57-.574zM8.848 17H3.259v-4.647h5.589zm6.632 0H9.892v-4.647h5.588zm6.641 0h-5.6v-4.647h5.6zm6.621 0h-5.59v-4.647h5.59zm-3.992 5.812a2.188 2.188 0 1 1-2.188-2.188 2.188 2.188 0 0 1 2.188 2.188z" /></svg>
              </span>
              <span className="mx-2">=</span>
              <span>Regionbuss, riktig plassering</span>
            </div>
            <div className="mb-3">
              <span className={`p-1 bg-color-bat text-gray-50 inline-flex items-center justify-center text-3x w-10 h-10 rounded-full`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentcolor" viewBox="0 0 32 32"><path d="M26.116 21.374l-.246-.152a5.452 5.452 0 0 0-6.106 0 4.027 4.027 0 0 1-2.463.767 4.015 4.015 0 0 1-2.462-.767 5.14 5.14 0 0 0-3.055-.936 5.125 5.125 0 0 0-3.05.936 4.03 4.03 0 0 1-2.464.767 4.016 4.016 0 0 1-2.46-.767 6.286 6.286 0 0 0-1.423-.704L2 22.194a5.024 5.024 0 0 1 1.175.589 5.13 5.13 0 0 0 3.046.938 5.124 5.124 0 0 0 3.045-.938 3.992 3.992 0 0 1 2.452-.764 4.022 4.022 0 0 1 2.457.764 5.108 5.108 0 0 0 3.043.938 5.117 5.117 0 0 0 3.043-.938 4.325 4.325 0 0 1 4.91 0c.022.014.045.03.07.044zm-.449-6.676l-1.662-6.662c-.054-.182-.207-.252-.465-.252h-2.41l-.374-1.744a.449.449 0 0 0-.576-.265l-.005.002L17.45 6.93a.594.594 0 0 0-.447.664v2.123H6.987a.49.49 0 0 0-.46.45l-1.008 4.52H3.84a.428.428 0 0 0-.431.326l-.726 3.774a7.998 7.998 0 0 1 1.721.708 3.212 3.212 0 0 0 1.83.492 3.22 3.22 0 0 0 1.833-.492 7.167 7.167 0 0 1 3.684-.947 7.171 7.171 0 0 1 3.688.947 3.214 3.214 0 0 0 1.83.492 3.207 3.207 0 0 0 1.83-.492 7.188 7.188 0 0 1 3.69-.947 7.167 7.167 0 0 1 3.686.947l.272.14 3.197-4.347a.39.39 0 0 0-.376-.59zm-14.34 0H6.755l.508-2.394h4.065zm5.551 0h-4.64v-2.394h4.64zm.875 0v-2.394h4.6l.482 2.394z" /></svg>
              </span>
              <span className="mx-2">=</span>
              <span>Båt, riktig plassering</span>
            </div>
            <div className="mb-3">
              <span className={`p-1 bg-color-tbane text-gray-50 inline-flex items-center justify-center text-3x w-10 h-10 rounded-full`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M10 11.39V9h12v2.39h-4.6v13.29h-2.85V11.39z" /><path d="M16 4A12 12 0 1 1 4 16 12 12 0 0 1 16 4m0-2a14 14 0 1 0 14 14A14 14 0 0 0 16 2z" /></svg>
              </span>
              <span className="mx-2">=</span>
              <span>T-bane, riktig plassering</span>
            </div>
            <div className="mb-3">
              <span className={`p-1 bg-color-bybuss text-gray-50 inline-flex items-center  justify-center text-3x w-10 h-10 rounded-full`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M11.625 22.812a2.188 2.188 0 1 1-2.188-2.188 2.188 2.188 0 0 1 2.188 2.188zM29.429 10H2.572a.574.574 0 0 0-.572.573v11.228a.575.575 0 0 0 .572.573h3.347a3.543 3.543 0 0 1 7.037 0h6.088a3.543 3.543 0 0 1 7.037 0h3.348a.575.575 0 0 0 .571-.573V10.574a.574.574 0 0 0-.57-.574zM8.848 17H3.259v-4.647h5.589zm6.632 0H9.892v-4.647h5.588zm6.641 0h-5.6v-4.647h5.6zm6.621 0h-5.59v-4.647h5.59zm-3.992 5.812a2.188 2.188 0 1 1-2.188-2.188 2.188 2.188 0 0 1 2.188 2.188z" /></svg>
              </span>
              <span className="mx-2">=</span>
              <span>Bybuss, riktig plassering</span>
            </div>
            <div className="mb-3">
              <span className={`p-1 bg-color-trikk text-gray-50 inline-flex items-center justify-center text-3x w-10 h-10 rounded-full`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M2.998 24.007h26V26h-26zm26.953-6.324l-.54-2.417-.947-4.22-.13-.57a.634.634 0 0 0-.597-.476H16.229l2.543-2.227a.662.662 0 0 0-.025-1.021l-3.432-2.745h-2.151l4.115 3.289L14.189 10H4.26a.64.64 0 0 0-.6.477l-.529 2.368-1.007 4.485-.079.353a3.09 3.09 0 0 0 .39 2.081l1.059 1.5H7v.759a.985.985 0 0 0 .984.977h3.043a.983.983 0 0 0 .987-.977v-.759h7.995v.76a.985.985 0 0 0 .987.976h3.042a.985.985 0 0 0 .985-.977v-.759h3.48l1.057-1.5a3.076 3.076 0 0 0 .39-2.081zM9.013 17H3.505l.913-4.647h4.595zm6.498 0h-5.51v-4.647h5.51zm6.497 0h-5.51v-4.647h5.51zm.99 0v-4.647h4.58L28.49 17z" /></svg>
              </span>
              <span className="mx-2">=</span>
              <span>Trikk, riktig plassering</span>
            </div>
            <div className={`mb-3 flex items-center`}>
              <span className={`bg-color-half-right text-gray-50 inline-flex items-center justify-center text-3x w-10 h-10 rounded-full`}>
                W
              </span>
              <span className="mx-2">=</span>
              <span>Riktig bokstav, feil plassering</span>
            </div>
            <div className={`mb-3 flex items-center`}>
              <span className={`bg-color-wrong text-gray-50 inline-flex items-center justify-center text-3x w-10 h-10 rounded-full`}>
                W
              </span>
              <span className="mx-2">=</span>
              <span>Feil bokstav</span>
            </div>
          </div>
        </div>
        <div className="flex justify-center sm:text-base text-sm">
          <span>Dette prosjektet er åpen kildekode på:</span>
          <a
            className="ml-[6px] rounded-full h-5 w-5 sm:h-6 sm:w-6"
            href="https://github.com/monkeecheetah/wordle_archive"
            target="_blank"
            rel="noreferrer"
          >
            <Github />
          </a>
          Data om rutene er hentet fra Entur sin <a href="https://developer.entur.org/stops-and-timetable-data">utviklerprotal.</a>
          Ruter har ingen kobling mot denne applikasjonen og har ikke godkjent bruk av deres data.
          Dataen er lisensisert under <a href="https://data.norge.no/nlod/no/">NLOD</a>.
        </div>
      </div>
    </div>
  </Modal>
)
