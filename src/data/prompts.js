import { subjects, verbs, endings } from '../enums/promptParts'

export const prompts = Array.from({ length: 5000 }, (_, i) => {
  const subject = subjects[i % subjects.length]
  const verb = verbs[Math.floor(i / subjects.length) % verbs.length]
  const ending = endings[Math.floor(i / (subjects.length * verbs.length)) % endings.length]

  return `${verb} ${subject}${ending}`
})

const subjectsDE = [
  'deinen Lieblingsurlaub',
  'deinen besten Freund',
  'eine Morgenroutine',
  'eine Kindheitserinnerung',
  'einen Ort, den du besuchen möchtest',
  'ein Hobby, das du genießt',
  'dein Lieblingsessen',
  'einen Film, den du magst',
  'dein Lieblingsbuch',
  'einen denkwürdigen Tag',
  'deinen Traumberuf',
  'ein typisches Wochenende',
  'ein Ziel, das du hast',
  'ein lustiges Ereignis, das dir passiert ist',
  'das Letzte, was du gelernt hast',
  'eine Person, die du bewunderst',
  'eine Tradition in deinem Land',
  'das Wetter heute',
  'eine Fähigkeit, die du verbessern möchtest',
  'deine Lieblingsjahreszeit',
  'eine Reiseerinnerung',
  'eine Freundschaftsgeschichte',
  'eine Schulerfahrung',
  'eine Familientradition',
  'deinen Lieblingssport',
  'eine gesunde Gewohnheit',
  'eine tägliche Routine',
  'eine kürzliche Feier',
  'deine Lieblingsmusik',
  'eine neue Technologie',
  'eine besondere Mahlzeit',
  'einen friedlichen Ort',
  'ein Ziel für die Zukunft',
  'einen Ort, an dem du dich ruhig fühlst',
  'eine Zeit, in der du jemandem geholfen hast',
  'deine Lieblingsaktivität in einer Jahreszeit',
  'einen Film, den du kürzlich gesehen hast',
  'eine Geschichte über Freundlichkeit',
  'eine Herausforderung, die du überwunden hast',
  'einen Moment, auf den du stolz warst',
  'einen Ort, den du eines Tages besuchen möchtest',
  'eine Fähigkeit, die du lernen möchtest',
  'eine Erinnerung aus deiner Kindheit',
  'ein Fest in deinem Land',
  'eine Lieblingswochenendaktivität',
  'einen Ort, den du liebst',
  'ein Hobby, das du kürzlich begonnen hast',
  'eine Person, die dich inspiriert',
  'ein Buch, das dich verändert hat',
  'eine Lektion, die du kürzlich gelernt hast',
  'ein Projekt, an dem du gearbeitet hast',
  'deine Lieblingsapp',
  'ein Ziel, das du erreicht hast',
  'eine Person, die dir geholfen hat',
  'deine Morgenroutine',
  'eine Erinnerung aus dem letzten Jahr',
  'eine Zeit, in der du glücklich warst',
  'etwas, wofür du dankbar bist',
  'einen Ort in der Nähe deines Zuhauses',
  'eine neue Fähigkeit, die du lernen möchtest',
  'ein Buch, das du lesen möchtest',
  'eine Tradition, die du genießt',
  'dein Lieblingsurlaubsgeschenk',
  'eine Jahreszeit, die du liebst',
  'dein Lieblingsfrühstück',
  'eine Lektion aus einem Fehler',
  'eine beliebte Outdoor-Aktivität',
  'deine Lieblingsstadt',
  'ein Spiel, das du magst',
  'eine Chance, die du ergriffen hast',
]

const verbsDE = [
  'Beschreibe',
  'Erkläre',
  'Sprich über',
  'Teile',
  'Erzähle mir von',
  'Was denkst du über',
  'Warum magst du',
  'Wie würdest du',
  'Gib Einzelheiten über',
  'Diskutiere',
  'Teile deine Gedanken über',
  'Erzähle eine kurze Geschichte über',
  'Erkläre warum',
  'Beschreibe kurz',
  'Sprich kurz über',
]

const endingsDE = [
  '.',
  ' in ein oder zwei Sätzen.',
  ' und erkläre warum.',
  ' mit einem kurzen Beispiel.',
  ' und beschreibe, wie es dich fühlen lässt.',
  ' benutze ein klares Beispiel.',
  ' mit deinen eigenen Worten.',
  ' und erwähne, warum es wichtig ist.',
  ' mit einer kurzen Erklärung.',
]

export const promptsDE = Array.from({ length: 5000 }, (_, i) => {
  const subject = subjectsDE[i % subjectsDE.length]
  const verb = verbsDE[Math.floor(i / subjectsDE.length) % verbsDE.length]
  const ending = endingsDE[Math.floor(i / (subjectsDE.length * verbsDE.length)) % endingsDE.length]

  return `${verb} ${subject}${ending}`
})

const subjectsRU = [
  'свой любимый праздник',
  'своего лучшего друга',
  'утреннюю рутину',
  'воспоминание из детства',
  'место, которое вы хотите посетить',
  'хобби, которое вам нравится',
  'ваше любимое блюдо',
  'фильм, который вам нравится',
  'вашу любимую книгу',
  'памятный день',
  'вашу работу мечты',
  'типичный уикенд',
  'цель, которую вы имеете',
  'смешной случай, который с вами произошёл',
  'последнее, чему вы научились',
  'человека, которым вы восхищаетесь',
  'традицию в вашей стране',
  'погоду сегодня',
  'навык, который вы хотите улучшить',
  'вашу любимую пору года',
  'воспоминание о путешествии',
  'историю дружбы',
  'опыт в школе',
  'семейную традицию',
  'ваш любимый вид спорта',
  'здоровую привычку',
  'ежедневную рутину',
  'недавний праздник',
  'вашу любимую музыку',
  'новую технологию',
  'особенное блюдо',
  'спокойное место',
  'цель на будущее',
  'место, где вы чувствуете себя спокойно',
  'момент, когда вы помогли кому-то',
  'любимое занятие на выходных',
  'фильм, который вы недавно смотрели',
  'историю о доброте',
  'преодолённый вызов',
  'момент, которым вы гордитесь',
  'место, которое вы хотите посетить когда-нибудь',
  'умение, которое вы хотели бы освоить',
  'воспоминание из детства',
  'праздник в вашей стране',
  'любимое занятие на выходных',
  'место, которое вы любите',
  'хобби, которое вы начали недавно',
  'человека, который вас вдохновляет',
  'книгу, которая изменила вас',
  'урок, который вы недавно усвоили',
  'проект, над которым вы работали',
  'ваше любимое приложение',
  'достижение, которым вы гордитесь',
  'человека, который вам помог',
  'утреннюю рутину',
  'воспоминание о прошлом году',
  'момент, когда вы были счастливы',
  'то, за что вы благодарны',
  'место рядом с вашим домом',
  'новый навык, который вы хотите выучить',
  'книгу, которую вы хотите прочитать',
  'традицию, которую вам нравится',
  'ваш любимый подарок на праздник',
  'пору года, которую вы любите',
  'ваш любимый завтрак',
  'урок из ошибки',
  'любимое занятие на свежем воздухе',
  'ваш любимый город',
  'игру, которая вам нравится',
  'шанс, который вы использовали',
]

const verbsRU = [
  'Опишите',
  'Объясните',
  'Поговорите о',
  'Поделитесь',
  'Расскажите мне о',
  'Что вы думаете о',
  'Почему вам нравится',
  'Как бы вы описали',
  'Приведите подробности о',
  'Обсудите',
  'Поделитесь своими мыслями о',
  'Расскажите короткую историю о',
  'Объясните, почему',
  'Опишите кратко',
  'Поговорите кратко о',
]

const endingsRU = [
  '.',
  ' в одном или двух предложениях.',
  ' и объясните, почему.',
  ' с коротким примером.',
  ' и опишите, какие это вызывает ощущения.',
  ' используя понятный пример.',
  ' своими словами.',
  ' и упомяните, почему это важно.',
  ' с кратким объяснением.',
]

export const promptsRU = Array.from({ length: 5000 }, (_, i) => {
  const subject = subjectsRU[i % subjectsRU.length]
  const verb = verbsRU[Math.floor(i / subjectsRU.length) % verbsRU.length]
  const ending = endingsRU[Math.floor(i / (subjectsRU.length * verbsRU.length)) % endingsRU.length]

  return `${verb} ${subject}${ending}`
})

const promptSets = {
  'en-US': prompts,
  'de-DE': promptsDE,
  'ru-RU': promptsRU,
}

export function getPromptForLang(lang = 'en-US'){
  return promptSets[lang] ?? prompts
}
