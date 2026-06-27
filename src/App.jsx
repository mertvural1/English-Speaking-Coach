import React, {useState, useRef, useEffect} from 'react'
import { normalizeText, compareWords } from './pronounceUtils'
import { prompts } from './data/prompts'
import Tutorial from './components/Tutorial'

function getRandomFallbackPrompt(){
  return prompts[Math.floor(Math.random() * prompts.length)]
}

function speak(text){
  if(!window.speechSynthesis) return

  const ut = new SpeechSynthesisUtterance(text)
  ut.lang = 'en-US'
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(ut)
}

function getRecognition(){
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

  if(!SpeechRecognition) return null

  const r = new SpeechRecognition()
  r.lang = 'en-US'
  r.interimResults = false
  r.maxAlternatives = 1
  return r
}

export default function App(){
  const [prompt, setPrompt] = useState(getRandomFallbackPrompt())
  const [loadingPrompt, setLoadingPrompt] = useState(false)
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [analysis, setAnalysis] = useState([])
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstallBanner, setShowInstallBanner] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)
  const recRef = useRef(null)

  const expected = prompt

  function handlePlay(){
    speak(expected)
  }

  function loadPrompt(){
    setPrompt(getRandomFallbackPrompt())
  }

  function handleNext(){
    loadPrompt()
    setTranscript('')
    setAnalysis([])
  }

  useEffect(() => {
    loadPrompt()
    
    // İlk ziyarett öğreticiyi göster
    const hasSeenTutorial = localStorage.getItem('english-coach-tutorial-seen')
    if (!hasSeenTutorial) {
      setShowTutorial(true)
      localStorage.setItem('english-coach-tutorial-seen', 'true')
    }
  }, [])

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
    const r = getRecognition()

    if(!r){
      alert('SpeechRecognition not supported in this browser.')
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

  function evaluate(rec){
    const expNorm = normalizeText(expected)
    const recNorm = normalizeText(rec)
    const expWords = expNorm.split(/\s+/).filter(Boolean)
    const recWords = recNorm.split(/\s+/).filter(Boolean)
    const res = compareWords(expWords, recWords)
    setAnalysis(res)
  }

  const correctCount = analysis.filter(a=>a.ok).length
  const score = analysis.length? Math.round((correctCount/analysis.length)*100):0

  return (
    <div className="min-h-screen bg-slate-50 py-5 px-4 sm:px-6 lg:px-8">
      <Tutorial isOpen={showTutorial} onClose={() => setShowTutorial(false)} />
      
      {showInstallBanner && (
        <div className="mx-auto mb-4 flex max-w-7xl items-center justify-between rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-xs md:text-sm text-indigo-800 shadow-sm">
          <span>Would you like to install this app on your desktop?</span>
          <button onClick={handleInstall} className="rounded-xl bg-indigo-600 px-3 py-2 font-semibold text-white transition hover:bg-indigo-700 text-xs md:text-sm">Install</button>
        </div>
      )}
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="rounded-3xl bg-indigo-600 p-4 md:p-6 text-white shadow-[0_28px_80px_rgba(99,102,241,0.12)]">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-xl md:text-3xl font-semibold tracking-tight sm:text-4xl">English Speaking Coach</h1>
              <p className="mt-1 md:mt-2 text-xs md:text-base text-indigo-100/90">Practice your English pronunciation with new exercises every time. Speak clearly, read naturally, and get instant feedback.</p>
            </div>
            <button
              onClick={() => setShowTutorial(true)}
              className="ml-4 rounded-full bg-white/20 p-2 text-xl hover:bg-white/30 transition flex-shrink-0"
              title="Show tutorial"
            >
              ?
            </button>
          </div>
        </header>

        <main className="rounded-3xl bg-white p-4 md:p-6 shadow-[0_28px_80px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/70">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Phrase to Speak</p>
              <p className="mt-3 text-base md:text-2xl font-semibold text-slate-900 sm:text-3xl">{expected}</p>
            </div>
            <div className="flex flex-wrap gap-1 min-w-[200px] justify-end">
              <button id="tutorial-play-btn" onClick={handlePlay} disabled={!prompt} className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-5 py-3 text-xs md:text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500">Play</button>
              <button onClick={handleNext} className="inline-flex items-center justify-center rounded-2xl bg-slate-100 px-5 py-3 text-xs md:text-sm font-semibold text-slate-700 transition hover:bg-slate-200">Next</button>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-stretch">
            <div className="flex-1 rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-medium text-slate-600">Your Transcript</p>
              <p className="mt-3 min-h-[3rem] text-lg text-slate-900">{transcript || <span className="text-slate-400">—</span>}</p>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-950 to-slate-900 p-4 text-white shadow-xl sm:justify-center lg:min-w-[220px] lg:flex-col lg:justify-center">
              <div id="tutorial-score" className="text-left sm:text-center">
                <p className="text-sm uppercase text-slate-300">Score</p>
                <p className="mt-1 text-xl font-semibold sm:text-4xl">{score}%</p>
              </div>
              <div className="flex flex-1 justify-end gap-2 sm:justify-center lg:mt-3 lg:w-full">
                <button id="tutorial-record-btn" onClick={handleStart} disabled={listening || !prompt} className="inline-flex flex-1 items-center justify-center rounded-2xl bg-emerald-500 px-3 py-2.5 text-xs md:text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 sm:min-w-[140px]">Start Recording</button>
                <button id="tutorial-stop-btn" onClick={handleStop} disabled={!listening} className="inline-flex flex-1 items-center justify-center rounded-2xl bg-rose-500 px-3 py-2.5 text-xs md:text-sm font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500">Stop</button>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-3 md:p-6">
            {analysis.length>0 && (
              <p className="mb-5 rounded-3xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-700">Feedback: {score>=80 ? 'Great! Keep speaking confidently.' : score>=50 ? 'Good work — focus on the red-highlighted words.' : 'Try again — speak clearly and slowly.'}</p>
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
      </div>
    </div>
  )
}
