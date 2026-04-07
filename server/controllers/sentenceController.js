const SENTENCES_BY_DIFFICULTY = {
  easy: [
    'The quick brown fox jumps over the lazy dog.',
    'Clean code is easier to read than to write.',
    'Good habits compound quietly over weeks and months.',
    'Measure what matters and ignore vanity metrics.',
    'A short break can improve focus during work.',
    'Practice makes confidence grow one keystroke at a time.',
    'Clear notes make teamwork easier for everyone.',
    'Simple systems are often the most reliable.',
    'Great teams learn quickly from small mistakes.',
    'Short goals help maintain steady daily progress.',
    'Reading code aloud can reveal unclear logic.',
    'Small wins create momentum for bigger tasks.',
    'Consistent practice builds speed and confidence.',
    'Well named variables reduce cognitive load.',
    'Careful planning prevents rushed decisions later.',
    'Simple interfaces make products easier to use.',
    'Healthy routines support long term focus.',
    'Clear feedback helps users fix errors faster.',
  ],
  medium: [
    'Consistency beats intensity when learning a new skill.',
    'Small daily progress can lead to big long term results.',
    'Focus on accuracy first and speed will follow naturally.',
    'Readable names make debugging faster for everyone involved.',
    'Ship small improvements often instead of waiting for perfection.',
    'Code reviews are easier when commits stay focused.',
    'A calm mind usually produces better technical decisions.',
    'Strong fundamentals make advanced topics much easier.',
    'Reliable deployments require repeatable build steps.',
    'Confidence grows through practice and honest reflection.',
    'Thoughtful defaults reduce friction for first time users.',
    'Effective meetings start with clear goals and outcomes.',
    'Reducing scope can be the fastest path to delivery.',
    'Good documentation shortens onboarding for new teammates.',
    'Small refactors prevent large rewrites in the future.',
    'Structured debugging reveals patterns behind recurring bugs.',
    'Polished details can improve trust in a product quickly.',
    'Reliable tools remove uncertainty from everyday workflows.',
    'Intentional practice sessions outperform random repetition.',
    'Balanced priorities protect quality under tight deadlines.',
  ],
  hard: [
    'Automation removes repetitive work and prevents human mistakes.',
    'Testing edge cases early saves time before release day.',
    'Design choices should support clarity before decoration.',
    'Reliable software handles bad input without crashing.',
    'Refactoring is easiest when behavior is covered by tests.',
    'Use simple language when explaining complex systems.',
    'Performance tuning starts with careful measurement first.',
    'Simple checklists prevent common mistakes under pressure.',
    'Good architecture balances flexibility with clear constraints.',
    'Strong communication is a technical skill in every team.',
    'Asynchronous workflows demand explicit contracts between services.',
    'Robust systems degrade gracefully when dependencies become unavailable.',
    'Observability strategy should prioritize actionable signals over noise.',
    'Deterministic builds reduce release risk across multiple environments.',
    'Architectural complexity increases when ownership boundaries stay ambiguous.',
    'Performance regressions often hide behind seemingly harmless feature work.',
    'Scalable systems require disciplined capacity planning and load testing.',
    'Operational resilience depends on rehearsed incident response playbooks.',
    'Long term maintainability is shaped by everyday design decisions.',
    'Production reliability improves when assumptions are continuously validated.',
  ],
}

function getDifficulty(queryDifficulty) {
  if (queryDifficulty === 'easy' || queryDifficulty === 'medium' || queryDifficulty === 'hard') {
    return queryDifficulty
  }

  return 'medium'
}

function getRandomSentence(request, response) {
  const difficulty = getDifficulty(request.query.difficulty)
  const pool = SENTENCES_BY_DIFFICULTY[difficulty]
  const randomIndex = Math.floor(Math.random() * pool.length)

  response.json({
    sentence: pool[randomIndex],
    difficulty,
  })
}

module.exports = {
  getRandomSentence,
}
