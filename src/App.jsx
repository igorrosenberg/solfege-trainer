import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import './App.css'

const CLEFS = [
  { id: 'la' },
  { id: 'sol' }
]

function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function App() {
  const { t, i18n } = useTranslation()
  const [selectedClef, setSelectedClef] = useState(null)
  const [images, setImages] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showSolution, setShowSolution] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    document.title = t('app.title')
  }, [t])

  useEffect(() => {
    if (selectedClef) {
      setLoading(true)
      fetch(`./${selectedClef}-images.json`)
        .then(response => response.json())
        .then(imageList => {
          setImages(shuffleArray(imageList))
          setCurrentIndex(0)
          setShowSolution(false)
          setLoading(false)
        })
        .catch(error => {
          console.error('Error loading images:', error)
          setLoading(false)
        })
    }
  }, [selectedClef])

  const handleClick = useCallback(() => {
    if (!showSolution) {
      setShowSolution(true)
    } else {
      if (currentIndex < images.length - 1) {
        setCurrentIndex(currentIndex + 1)
        setShowSolution(false)
      } else {
        setSelectedClef(null)
        setImages([])
        setCurrentIndex(0)
        setShowSolution(false)
      }
    }
  }, [showSolution, currentIndex, images.length])

  useEffect(() => {
    if (!selectedClef) return

    const handleKeyDown = (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        handleClick()
      } else if (e.key === 'Escape') {
        setSelectedClef(null)
        setImages([])
        setCurrentIndex(0)
        setShowSolution(false)
      } else if (e.key === 'Backspace') {
        e.preventDefault()
        if (currentIndex > 0) {
          setCurrentIndex(currentIndex - 1)
          setShowSolution(false)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedClef, handleClick, currentIndex])

  if (!selectedClef) {
    return (
      <div className="clef-selection">
        <h1>{t('app.title')}</h1>
        <p>{t('app.chooseClef')}</p>
        <div className="clef-buttons">
          {CLEFS.map(clef => (
            <button
              key={clef.id}
              onClick={() => setSelectedClef(clef.id)}
              className="clef-button"
            >
              {t(`clefs.${clef.id}`)}
            </button>
          ))}
        </div>
        <div className="language-footer">
          <button
            onClick={() => i18n.changeLanguage('en')}
            className={i18n.language === 'en' ? 'active' : ''}
          >
            EN
          </button>
          <span className="language-separator">/</span>
          <button
            onClick={() => i18n.changeLanguage('fr')}
            className={i18n.language === 'fr' ? 'active' : ''}
          >
            FR
          </button>
        </div>
      </div>
    )
  }

  if (loading || images.length === 0) {
    return (
      <div className="clef-selection">
        <h1>{t('app.loading')}</h1>
      </div>
    )
  }

  const currentImage = images[currentIndex]
  const imagePath = `./${selectedClef}/${currentImage}`

  const parseImageName = (filename) => {
    const match = filename.match(/^(\w+)\s(\w+)\s(\d+)\.jpg$/)
    if (match) {
      return { note: match[2], number: match[3] }
    }
    return { note: '', number: '' }
  }

  const { note, number } = parseImageName(currentImage)

  return (
    <div className="quiz-container">
      <div className="header">
        <div className="breadcrumbs">
          <button onClick={() => setSelectedClef(null)} className="breadcrumb-link">
            {t('app.home')}
          </button>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">
            {t(`clefs.${selectedClef}`)}
          </span>
        </div>
        <div className="counter">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      <div className="quiz-content" onClick={handleClick} style={{ cursor: 'pointer' }}>
        <div className="hover-instruction">
          {showSolution
            ? (currentIndex < images.length - 1
                ? t('instructions.continue')
                : t('instructions.finish'))
            : t('instructions.showAnswer')}
        </div>

        <div className="question-area">
          <img
            src={imagePath}
            alt={t('alt.solfegeQuestion')}
            className="solfege-image"
          />
        </div>

        <div className="answer-area">
          {showSolution ? (
            <p className="solution">
              <span className="note">{note}</span>
              <span className="number">({number})</span>
            </p>
          ) : (
            <p className="question-mark">?</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
