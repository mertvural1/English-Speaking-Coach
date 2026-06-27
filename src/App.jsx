import React, {useState, useRef, useEffect} from 'react'
import { normalizeText, compareWords } from './pronounceUtils'
import { prompts } from './data/prompts'

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
  }, [])

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
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="rounded-3xl bg-indigo-600 p-4 md:p-6 text-white shadow-[0_28px_80px_rgba(99,102,241,0.12)]">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight sm:text-4xl">English Speaking Coach</h1>
          <p className="mt-1 md:mt-2 text-sm md:text-base text-indigo-100/90">Practice your pronunciation with fresh prompts every time. Speak clearly, read naturally, and get instant feedback.</p>
        </header>

        <main className="rounded-3xl bg-white p-4 md:p-6 shadow-[0_28px_80px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/70">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Prompt</p>
              <p className="mt-3 text-lg md:text-2xl font-semibold text-slate-900 sm:text-3xl">{expected}</p>
            </div>
            <div className="flex flex-wrap gap-1 min-w-[200px] justify-end">
              <button onClick={handlePlay} disabled={!prompt} className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500">Play</button>
              <button onClick={handleNext} className="inline-flex items-center justify-center rounded-2xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200">Next Prompt</button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-600">Your transcript</p>
              <p className="mt-3 min-h-[3rem] text-lg text-slate-900">{transcript || <span className="text-slate-400">—</span>}</p>
            </div>
            <div className="rounded-3xl border text-center border-slate-200 bg-gradient-to-br from-slate-950 to-slate-900 p-4 text-white shadow-xl">
              <p className="text-sm uppercase text-slate-300">Score</p>
              <p className="mt-3 text-4xl font-semibold">{score}%</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
            <button onClick={handleStart} disabled={listening || !prompt} className="inline-flex min-w-[160px] items-center justify-center rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500">Start Recording</button>
            <button onClick={handleStop} disabled={!listening} className="inline-flex min-w-[160px] items-center justify-center rounded-2xl bg-rose-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500">Stop</button>
          </div>

          <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
            {analysis.length>0 && (
              <p className="mb-5 rounded-3xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-700">Feedback: {score>=80 ? 'Great! Keep speaking confidently.' : score>=50 ? 'Good work — focus on the underlined words.' : 'Try again — speak clearly and slowly.'}</p>
            )}
            <div className="flex flex-wrap gap-2">
              {analysis.length>0 ? (
                analysis.map((a,i)=> (
                  <span key={i} className={`inline-flex rounded-full px-4 py-2 text-sm font-medium ${a.ok ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'} `} title={a.spoken || '(not said)'}>
                    {a.expected}
                  </span>
                ))
              ) : (
                expected.split(' ').map((w,i)=> <span key={i} className="inline-flex rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700">{w}</span>)
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
