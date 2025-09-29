// Utilidad simple para generar un banco local de preguntas como fallback
// Formato requerido por el backend:
// { text, options: string[4], correctAnswerIndex: number, category, difficulty, explanation }

const BASE_QUESTIONS = [
  {
    text: '¿Cuál es la capital de Francia?',
    options: ['Madrid', 'París', 'Roma', 'Berlín'],
    correctAnswerIndex: 1,
    explanation: 'París es la capital de Francia.'
  },
  {
    text: '¿Cuánto es 5 + 7?',
    options: ['10', '11', '12', '13'],
    correctAnswerIndex: 2,
    explanation: '5 + 7 = 12.'
  },
  {
    text: '¿Qué planeta es conocido como el Planeta Rojo?',
    options: ['Venus', 'Marte', 'Júpiter', 'Saturno'],
    correctAnswerIndex: 1,
    explanation: 'Marte es llamado el Planeta Rojo.'
  },
  {
    text: '¿Quién escribió "Cien años de soledad"?',
    options: ['Pablo Neruda', 'Isabel Allende', 'Gabriel García Márquez', 'Jorge Luis Borges'],
    correctAnswerIndex: 2,
    explanation: 'Gabriel García Márquez es el autor.'
  },
  {
    text: '¿Cuál es el río más largo del mundo?',
    options: ['Nilo', 'Amazonas', 'Yangtsé', 'Misisipi'],
    correctAnswerIndex: 1,
    explanation: 'El Amazonas es el más largo según mediciones recientes.'
  },
  {
    text: '¿Cuál es el resultado de 9 × 6?',
    options: ['42', '52', '54', '56'],
    correctAnswerIndex: 2,
    explanation: '9 x 6 = 54.'
  },
  {
    text: '¿Qué gas respiramos principalmente?',
    options: ['Oxígeno', 'Dióxido de carbono', 'Nitrógeno', 'Hidrógeno'],
    correctAnswerIndex: 2,
    explanation: 'El aire es ~78% nitrógeno.'
  },
  {
    text: '¿En qué continente está Egipto?',
    options: ['Asia', 'Europa', 'África', 'América'],
    correctAnswerIndex: 2,
    explanation: 'Egipto se ubica en África.'
  },
  {
    text: '¿Qué instrumento tiene teclas blancas y negras?',
    options: ['Violín', 'Guitarra', 'Piano', 'Flauta'],
    correctAnswerIndex: 2,
    explanation: 'El piano tiene teclas blancas y negras.'
  },
  {
    text: '¿Cuál es el símbolo químico del oro?',
    options: ['Ag', 'Au', 'Fe', 'Cu'],
    correctAnswerIndex: 1,
    explanation: 'El símbolo del oro es Au.'
  }
]

export function getPresetQuestions(topicId, difficultyId, count) {
  const difficultyMap = {
    facil: 'easy',
    medio: 'medium',
    dificil: 'hard'
  }
  const difficulty = difficultyMap[difficultyId] || difficultyId || 'medium'
  const category = topicId || 'general'

  // Replica y corta al tamaño requerido
  const pool = []
  while (pool.length < count) {
    pool.push(...BASE_QUESTIONS)
  }
  const sliced = pool.slice(0, count).map((q) => ({
    ...q,
    category,
    difficulty
  }))

  return sliced
}

export function mapDifficultyIdToApi(id) {
  if (!id) return 'medium'
  // Normalizar y quitar acentos: 'fácil' -> 'facil', 'difícil' -> 'dificil'
  const normalized = id
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
  const map = { facil: 'easy', medio: 'medium', dificil: 'hard' }
  return map[normalized] || normalized
}


