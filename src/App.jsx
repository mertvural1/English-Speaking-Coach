import React, {useState, useRef, useEffect} from 'react'
import { normalizeText, compareWords } from './pronounceUtils'
import { getPromptForLang } from './data/prompts'
import Tutorial from './components/Tutorial'

function getRandomFallbackPrompt(lang = 'en-US', level = 1){
  const promptList = getPromptForLang(lang, level)
  return promptList[Math.floor(Math.random() * promptList.length)]
}

const languageOptions = [
  { value: 'en-US', label: 'English' },
  { value: 'de-DE', label: 'Deutsch' },
  { value: 'ru-RU', label: 'Русский' },
]

const uiText = {
  'en-US': {
    appName: 'English Speaking Coach',
    description: 'Practice your English pronunciation with new exercises every time. Speak clearly, read naturally, and get instant feedback.',
    installPrompt: 'Would you like to install this app on your desktop?',
    language: 'Language',
    phrase: 'Phrase to Speak',
    play: 'Play',
    next: 'Next',
    startRecording: 'Start Recording',
    stop: 'Stop',
    score: 'Score',
    transcript: 'Your Transcript',
    placeholder: '—',
    installButton: 'Install',
    tutorialTitle: 'Show tutorial',
    unsupportedSpeech: 'SpeechRecognition not supported in this browser.',
    feedback: (score) => score >= 80 ? 'Great! Keep speaking confidently.' : score >= 50 ? 'Good work — focus on the red-highlighted words.' : 'Try again — speak clearly and slowly.',
  },
  'de-DE': {
    appName: 'Deutsch Sprachtrainer',
    description: 'Übe deine Aussprache auf Deutsch mit neuen Übungen. Sprich klar, natürlich und erhalte sofortiges Feedback.',
    installPrompt: 'Möchten Sie diese App auf Ihrem Desktop installieren?',
    language: 'Sprache',
    phrase: 'Satz zum Sprechen',
    play: 'Abspielen',
    next: 'Weiter',
    startRecording: 'Aufnahme starten',
    stop: 'Stopp',
    score: 'Punktzahl',
    transcript: 'Ihr Transkript',
    placeholder: '—',
    installButton: 'Installieren',
    tutorialTitle: 'Tutorial anzeigen',
    unsupportedSpeech: 'Spracherkennung wird in diesem Browser nicht unterstützt.',
    feedback: (score) => score >= 80 ? 'Super! Sprich weiter so selbstbewusst.' : score >= 50 ? 'Gute Arbeit — achte auf die rot markierten Wörter.' : 'Versuche es noch einmal — sprich klarer und langsamer.',
  },
  'ru-RU': {
    appName: 'Русский тренер по речи',
    description: 'Практикуйте произношение на русском языке с новыми заданиями. Говорите чётко, естественно и получайте мгновенную обратную связь.',
    installPrompt: 'Хотите установить это приложение на рабочий стол?',
    language: 'Язык',
    phrase: 'Фраза для произнесения',
    play: 'Воспроизвести',
    next: 'Далее',
    startRecording: 'Начать запись',
    stop: 'Стоп',
    score: 'Оценка',
    transcript: 'Ваш текст',
    placeholder: '—',
    installButton: 'Установить',
    tutorialTitle: 'Показать руководство',
    unsupportedSpeech: 'Распознавание речи не поддерживается в этом браузере.',
    feedback: (score) => score >= 80 ? 'Отлично! Говорите уверенно дальше.' : score >= 50 ? 'Хорошая работа — обратите внимание на слова в красном.' : 'Попробуйте снова — говорите чётче и медленнее.',
  },
}

function speak(text, lang = 'en-US'){
  if(!window.speechSynthesis) return

  const ut = new SpeechSynthesisUtterance(text)
  ut.lang = lang
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(ut)
}

function getRecognition(lang = 'en-US'){
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

  if(!SpeechRecognition) return null

  const r = new SpeechRecognition()
  r.lang = lang
  r.interimResults = false
  r.maxAlternatives = 1
  return r
}

export default function App(){
  const [prompt, setPrompt] = useState(() => getRandomFallbackPrompt('en-US', 1))
  const [language, setLanguage] = useState('en-US')
  const [level, setLevel] = useState(1)
  const [levelMessage, setLevelMessage] = useState('')
  const maxLevel = 10
  const [loadingPrompt, setLoadingPrompt] = useState(false)
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [analysis, setAnalysis] = useState([])
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstallBanner, setShowInstallBanner] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [lastConfettiScore, setLastConfettiScore] = useState(null)
  const confettiTimeoutRef = useRef(null)
  const recRef = useRef(null)

  const expected = prompt

  const text = uiText[language] || uiText['en-US']

  function handlePlay(){
    speak(expected, language)
  }

  function loadPrompt(lang = 'en-US', lvl = 1){
    setPrompt(getRandomFallbackPrompt(lang, lvl))
  }

  function handleNext(){
    loadPrompt(language, level)
    setTranscript('')
    setAnalysis([])
    setLevelMessage('')
  }

  useEffect(() => {
    loadPrompt(language, level)
    
    // İlk ziyarett öğreticiyi göster
    const hasSeenTutorial = localStorage.getItem('english-coach-tutorial-seen')
    if (!hasSeenTutorial) {
      setShowTutorial(true)
      localStorage.setItem('english-coach-tutorial-seen', 'true')
    }
  }, [])

  useEffect(() => {
    loadPrompt(language, level)
    setTranscript('')
    setAnalysis([])
  }, [language, level])

  useEffect(() => {
    if (!levelMessage) return
    const timer = setTimeout(() => setLevelMessage(''), 3200)
    return () => clearTimeout(timer)
  }, [levelMessage])

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault()
      setDeferredPrompt(event)
      setShowInstallBanner(true)
    }

    const handleAppInstalled = () => {
      setDeferredPrompt(null)
      setShowInstallBanner(false)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  function handleInstall(){
    if(!deferredPrompt) return

    deferredPrompt.prompt()
    setShowInstallBanner(false)
  }

  function handleStart(){
    const r = getRecognition(language)

    if(!r){
      alert(text.unsupportedSpeech)
      return
    }

    setListening(true)
    setTranscript('')
    setAnalysis([])
    r.onresult = (e)=>{
      const t = e.results[0][0].transcript
      setTranscript(t)
      evaluate(t)
    }
    r.onerror = ()=>{
      setListening(false)
    }
    r.onend = ()=>{
      setListening(false)
    }
    recRef.current = r
    r.start()
  }

  function handleStop(){
    const r = recRef.current

    if(r){
      try{ r.stop() }catch(e){}
      setListening(false)
    }
  }

  function triggerConfetti(){
    setShowConfetti(true)
    if(confettiTimeoutRef.current){
      clearTimeout(confettiTimeoutRef.current)
    }
    confettiTimeoutRef.current = setTimeout(() => {
      setShowConfetti(false)
      confettiTimeoutRef.current = null
    }, 3200)
  }

  function evaluate(rec){
    const expNorm = normalizeText(expected)
    const recNorm = normalizeText(rec)
    const expWords = expNorm.split(/\s+/).filter(Boolean)
    const recWords = recNorm.split(/\s+/).filter(Boolean)
    const res = compareWords(expWords, recWords)
    setAnalysis(res)
  }

  useEffect(() => {
    const correctCount = analysis.filter(a => a.ok).length
    const currentScore = analysis.length ? Math.round((correctCount / analysis.length) * 100) : 0
    if (currentScore === 100 && analysis.length > 0 && lastConfettiScore !== 100) {
      triggerConfetti()
      setLastConfettiScore(100)
      if (level < maxLevel) {
        const nextLevel = level + 1
        setLevel(nextLevel)
        setLevelMessage(`Level ${nextLevel} unlocked!`)
        setTranscript('')
        setAnalysis([])
      } else {
        setLevelMessage('Top level reached!')
        loadPrompt(language, level)
        setTranscript('')
        setAnalysis([])
      }
    }
    if (currentScore !== 100 && lastConfettiScore !== null) {
      setLastConfettiScore(null)
    }
  }, [analysis, lastConfettiScore, level, language])

  const correctCount = analysis.filter(a=>a.ok).length
  const score = analysis.length? Math.round((correctCount/analysis.length)*100):0

  return (
    <div className="min-h-screen bg-slate-50 py-5 px-4 sm:px-6 lg:px-8">
      <Tutorial isOpen={showTutorial} onClose={() => setShowTutorial(false)} language={language} />
      
      {showInstallBanner && (
        <div className="mx-auto mb-4 flex max-w-7xl items-center justify-between rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-xs md:text-sm text-indigo-800 shadow-sm">
          <span>{text.installPrompt}</span>
          <button onClick={handleInstall} className="rounded-xl bg-indigo-600 px-3 py-2 font-semibold text-white transition hover:bg-indigo-700 text-xs md:text-sm">{text.installButton}</button>
        </div>
      )}
      <div className="relative mx-auto flex max-w-7xl flex-col gap-6">
        <header className="rounded-3xl bg-indigo-600 p-4 md:p-6 text-white shadow-[0_28px_80px_rgba(99,102,241,0.12)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <h1 className="text-xl md:text-3xl font-semibold tracking-tight sm:text-4xl">{text.appName}</h1>
              <p className="mt-3 md:mt-2 text-xs md:text-base text-indigo-100/90">{text.description}</p>
            </div>
            <div className="flex items-center gap-3 sm:ml-4">
              <div className="relative flex items-center rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-900 text-sm text-left">
                <select
                  id="language-select"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-transparent pr-8 text-sm outline-none appearance-none"
                >
                  {languageOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">▾</span>
              </div>
              <button
                onClick={() => setShowTutorial(true)}
                className="rounded-full bg-white/20 text-xl hover:bg-white/30 transition size-8"
                title={text.tutorialTitle}
              >
                ?
              </button>
            </div>
          </div>
        </header>

        {showConfetti && (
          <div className="pointer-events-none absolute inset-x-0 top-0 z-50 h-[100vh] overflow-hidden">
            {Array.from({ length: 36 }).map((_, index) => {
              const left = Math.round((100 / 36) * index + Math.random() * 2)
              const delay = (index % 6) * 0.12
              const duration = 2.5 + (index % 5) * 0.16
              const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6']
              const color = colors[index % colors.length]
              const width = 2 + (index % 3)
              const height = 8 + (index % 4) * 2
              return (
                <span
                  key={index}
                  className="absolute top-0 rounded-sm opacity-90"
                  style={{
                    left: `${left}%`,
                    width: `${width}px`,
                    height: `${height}px`,
                    backgroundColor: color,
                    animation: `confettiFall ${duration}s ease-in ${delay}s forwards`,
                  }}
                />
              )
            })}
          </div>
        )}
        <main className="rounded-3xl bg-white p-4 md:p-6 shadow-[0_28px_80px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/70">
          {levelMessage && (
            <div className="mb-4 rounded-3xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 shadow-sm">{levelMessage}</div>
          )}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">{text.phrase}</p>
              <p className="mt-3 text-base md:text-2xl font-semibold text-slate-900 sm:text-3xl">{expected}</p>
            </div>
            <div className="flex flex-col gap-3 sm:items-end">
              <div className="flex flex-wrap gap-1 min-w-[200px] justify-end">
                <button id="tutorial-play-btn" onClick={handlePlay} disabled={!prompt} className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-5 py-3 text-xs md:text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500">{text.play}</button>
                <button onClick={handleNext} className="inline-flex items-center justify-center rounded-2xl bg-slate-100 px-5 py-3 text-xs md:text-sm font-semibold text-slate-700 transition hover:bg-slate-200">{text.next}</button>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-stretch">
            <div className="flex-1 rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-medium text-slate-600">{text.transcript}</p>
              <p className="mt-3 min-h-[3rem] text-lg text-slate-900">{transcript || <span className="text-slate-400">{text.placeholder}</span>}</p>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-950 to-slate-900 p-4 text-white shadow-xl sm:justify-center lg:min-w-[220px] lg:flex-col lg:justify-center">
              <div className="text-left sm:text-center">
                <p className="text-sm uppercase text-slate-300">{text.score}</p>
                <p className="mt-1 text-xl font-semibold sm:text-4xl">{score}%</p>
                <div className="mt-3 rounded-3xl bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/90">
                  Level {level} / {maxLevel}
                </div>
              </div>
              <div className="flex flex-1 justify-end gap-2 sm:justify-center lg:mt-3 lg:w-full">
                <button id="tutorial-record-btn" onClick={handleStart} disabled={listening || !prompt} className="inline-flex flex-1 items-center justify-center rounded-2xl bg-emerald-500 px-3 py-2.5 text-xs md:text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 sm:min-w-[140px]">{text.startRecording}</button>
                <button id="tutorial-stop-btn" onClick={handleStop} disabled={!listening} className="inline-flex flex-1 items-center justify-center rounded-2xl bg-rose-500 px-3 py-2.5 text-xs md:text-sm font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500">{text.stop}</button>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-3 md:p-6">
            {analysis.length>0 && (
              <p className="mb-5 rounded-3xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-700">{text.feedback(score)}</p>
            )}
            <div className="flex flex-wrap gap-2">
              {analysis.length>0 ? (
                analysis.map((a,i)=> (
                  <span key={i} className={`inline-flex rounded-full px-4 py-2 text-xs md:text-sm font-medium ${a.ok ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'} `} title={a.spoken || '(not said)'}>
                    {a.expected}
                  </span>
                ))
              ) : (
                expected.split(' ').map((w,i)=> <span key={i} className="inline-flex rounded-full bg-slate-100 px-3 py-2 text-xs md:text-sm text-slate-700">{w}</span>)
              )}
            </div>
          </div>
        </main>

        <footer className="mx-auto mt-6 max-w-7xl text-center text-xs text-slate-500">
          © 2026 Mert Vural
        </footer>
      </div>
      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(-100%) rotate(0deg); opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(120vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
