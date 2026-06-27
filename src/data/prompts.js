import { subjects, verbs, endings } from '../enums/promptParts'

export const prompts = Array.from({ length: 5000 }, (_, i) => {
  const subject = subjects[i % subjects.length]
  const verb = verbs[Math.floor(i / subjects.length) % verbs.length]
  const ending = endings[Math.floor(i / (subjects.length * verbs.length)) % endings.length]

  return `${verb} ${subject}${ending}`
})
