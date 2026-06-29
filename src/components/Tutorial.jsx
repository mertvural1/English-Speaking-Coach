import React from 'react'
import { Joyride, ACTIONS, STATUS } from 'react-joyride'

const tutorialTexts = {
  'en-US': [
    '👋 Welcome to English Speaking Coach! Practice your English pronunciation and get instant feedback. Follow the steps!',
    '🌐 Use the language selector to switch between English, German, or Russian practice.',
    '🔊 Click "Play" first to hear how the sentence should be pronounced.',
    '🎤 Then click "Start Recording" and speak the phrase clearly!',
    '⏹️ Click "Stop" when you finish speaking.',
    '📊 Here you\'ll see your score and feedback about your pronunciation.',
    '✨ You\'re all set! Start practicing now. You can reopen this tutorial anytime by clicking the "?" button.',
  ],
  'de-DE': [
    '👋 Willkommen beim Deutsch Sprachtrainer! Übe deine Aussprache und erhalte sofortiges Feedback. Folge den Schritten!',
    '🌐 Verwende den Sprachwähler, um zwischen Englisch, Deutsch oder Russisch zu wechseln.',
    '🔊 Klicke zuerst auf „Abspielen“, um zu hören, wie der Satz gesprochen werden sollte.',
    '🎤 Dann klicke auf „Aufnahme starten“ und sprich den Satz deutlich!',
    '⏹️ Klicke auf „Stopp“, wenn du fertig bist.',
    '📊 Hier siehst du deine Punktzahl und das Feedback zur Aussprache.',
    '✨ Du bist bereit! Starte jetzt mit dem Üben. Du kannst dieses Tutorial jederzeit erneut öffnen, indem du auf „?“ klickst.',
  ],
  'ru-RU': [
    '👋 Добро пожаловать в русский тренер по речи! Практикуйте своё произношение и получайте мгновенный отклик. Следуйте шагам!',
    '🌐 Используйте переключатель языка, чтобы выбрать практику на английском, немецком или русском.',
    '🔊 Сначала нажмите «Воспроизвести», чтобы услышать, как должно звучать предложение.',
    '🎤 Затем нажмите «Начать запись» и произносите фразу чётко!',
    '⏹️ Нажмите «Стоп», когда закончите.',
    '📊 Здесь вы увидите свой результат и отзыв о произношении.',
    '✨ Всё готово! Начните практиковать. Вы можете открыть это руководство снова, нажав «?».',
  ],
}

function getSteps(language) {
  const content = tutorialTexts[language] || tutorialTexts['en-US']

  return [
    {
      target: 'body',
      content: content[0],
      disableBeacon: true,
      placement: 'center',
    },
    {
      target: '#language-select',
      content: content[1],
      placement: 'bottom',
    },
    {
      target: '#tutorial-play-btn',
      content: content[2],
      placement: 'bottom',
    },
    {
      target: '#tutorial-record-btn',
      content: content[3],
      placement: 'top',
    },
    {
      target: '#tutorial-stop-btn',
      content: content[3],
      placement: 'top',
    },
    {
      target: '#tutorial-score',
      content: content[4],
      placement: 'left',
    },
    {
      target: 'body',
      content: content[5],
      placement: 'center',
    },
  ]
}

export default function Tutorial({ isOpen, onClose, language }) {
  const handleJoyrideCallback = (data) => {
    const { status, action } = data

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status) || action === ACTIONS.CLOSE) {
      onClose()
    }
  }

  // Custom Joyride CSS
  const joyrideStyles = `
    .react-joyride__overlay {
      opacity: 0.5;
    }
    
    .react-joyride__spotlight {
      border-radius: 12px;
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.5);
    }
    
    .react-joyride__tooltip {
      background-color: #fff;
      border-radius: 12px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      font-family: system-ui, -apple-system, sans-serif;
      max-width: 320px;
    }
    
    .react-joyride__tooltip__heading {
      font-size: 14px;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 8px;
    }
    
    .react-joyride__tooltip__body {
      font-size: 14px;
      color: #475569;
      line-height: 1.5;
    }
    
    .react-joyride__tooltip__footer {
      margin-top: 12px;
      display: flex;
      gap: 8px;
    }
    
    .react-joyride__tooltip__button {
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
    }
    
    .react-joyride__tooltip__button:hover {
      opacity: 0.9;
    }
    
    .react-joyride__tooltip__button__primary {
      background-color: #4f46e5;
      color: #fff;
    }
    
    .react-joyride__tooltip__button__skip {
      background-color: transparent;
      color: #64748b;
    }
    
    .react-joyride__tooltip__button__close {
      position: absolute;
      top: 8px;
      right: 8px;
      padding: 4px 8px;
      background: none;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      font-size: 16px;
    }
    
    .react-joyride__beaconInner {
      background-color: #4f46e5;
    }
    
    .react-joyride__beaconOuter {
      border-color: #4f46e5;
    }
  `

  return (
    <>
      <style>{joyrideStyles}</style>
      <Joyride
        steps={getSteps(language)}
        run={isOpen}
        continuous
        scrollToFirstStep
        showProgress
        showSkipButton
        callback={handleJoyrideCallback}
        styles={{
          options: {
            arrowColor: '#fff',
            backgroundColor: '#fff',
            overlayColor: 'rgba(0, 0, 0, 0.5)',
            primaryColor: '#4f46e5',
            textColor: '#1e293b',
            width: 320,
            zIndex: 10000,
          },
        }}
      />
    </>
  )
}
