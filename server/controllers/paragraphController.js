const PARAGRAPHS_BY_DIFFICULTY = {
  easy: [
    'Typing practice works best when you stay relaxed and focus on clean input. Start slowly, keep your rhythm steady, and build accuracy first. Speed naturally improves as your hands become more confident over time.',
    'Good software is often simple, readable, and predictable. Clear names and small functions help teams move quickly. When code is easy to understand, fixing bugs takes less effort for everyone.',
    'Small improvements made every day can create strong long term results. A short and focused session is better than a long distracted one. Consistency matters more than intensity for most skills.',
    'Learning becomes easier when goals are specific and realistic. Break tasks into small steps, celebrate each milestone, and keep showing up. Consistent effort usually beats occasional bursts of motivation.',
    'Clear communication helps teams avoid confusion and save time. Share context early, ask questions when unsure, and confirm decisions in writing. These habits make collaboration smoother for everyone involved.',
    'A comfortable setup can improve typing quality significantly. Keep your wrists relaxed, sit upright, and adjust keyboard height if needed. Small ergonomic changes can reduce fatigue during longer sessions.',
    'Reliable habits create steady long term progress in any skill. Practice regularly, review mistakes without frustration, and keep your pace controlled. Accuracy improves quickly when your routine remains consistent.',
  ],
  medium: [
    'Building reliable products requires consistent habits across design, development, and review. Teams that write clear documentation and communicate tradeoffs early usually avoid avoidable delays and confusing rework near release dates.',
    'Performance tuning should begin with evidence, not assumptions. Measure baseline behavior, identify the slowest operations, and validate each optimization with real metrics. This process prevents unnecessary complexity and protects long term maintainability.',
    'Healthy engineering culture depends on thoughtful collaboration. Focused pull requests, constructive feedback, and explicit ownership improve delivery quality. Over time, these practices reduce production incidents and increase trust across teams.',
    'Feature development moves faster when constraints are explicit from the start. Defining scope, risks, and success metrics early helps teams prioritize confidently. This clarity reduces rework and keeps delivery timelines realistic.',
    'User experience improves when feedback loops are short and meaningful. Fast loading states, clear error messages, and consistent visual cues reduce friction. Small interaction details can greatly improve perceived product quality.',
    'Maintainable codebases are shaped by many small decisions over time. Reusable patterns, concise modules, and clear interfaces improve readability. Teams that invest in structure now avoid painful rewrites later.',
    'Release stability depends on predictable workflows and shared standards. Automated checks, incremental rollouts, and rollback plans lower operational risk. A disciplined process keeps delivery speed high without sacrificing confidence.',
  ],
  hard: [
    'Complex systems fail in subtle ways when observability is treated as an afterthought. Instrumentation, structured logs, and actionable alerts transform unknown failures into diagnosable events, allowing teams to recover faster and make decisions rooted in evidence rather than intuition.',
    'Architectural decisions should balance immediate product needs with long term operational costs. Choosing abstractions too early can freeze iteration speed, while postponing necessary structure can multiply integration risk and create brittle dependencies that are expensive to unwind.',
    'Scalable collaboration emerges from disciplined workflow patterns, including consistent branching strategy, deterministic build pipelines, and explicit release criteria. These constraints reduce ambiguity, improve reproducibility, and preserve development velocity even as system complexity expands.',
    'Distributed systems require careful consideration of partial failure, data consistency, and retry semantics. Without explicit idempotency and timeout strategies, transient faults can cascade into prolonged outages. Designing for failure from the beginning is essential for resilient production behavior.',
    'High performance architecture is rarely achieved through isolated optimizations alone. Sustainable gains usually come from coordinated improvements across query design, caching policy, concurrency limits, and workload shaping. Each layer influences the others in measurable and sometimes unexpected ways.',
    'As organizations scale, technical debt becomes a portfolio management problem rather than a binary choice. Prioritizing debt reduction alongside product delivery demands clear ownership, quantified impact, and deliberate scheduling. Ignoring this balance eventually slows execution across every team.',
    'Security posture improves when threat modeling is integrated into everyday engineering decisions. Access boundaries, input validation, and dependency hygiene should be treated as baseline requirements. Strong defaults prevent classes of vulnerabilities before they reach production environments.',
  ],
}

function getDifficulty(queryDifficulty) {
  if (queryDifficulty === 'easy' || queryDifficulty === 'medium' || queryDifficulty === 'hard') {
    return queryDifficulty
  }

  return 'medium'
}

function getRandomParagraph(request, response) {
  const difficulty = getDifficulty(request.query.difficulty)
  const pool = PARAGRAPHS_BY_DIFFICULTY[difficulty]
  const randomIndex = Math.floor(Math.random() * pool.length)

  response.json({
    paragraph: pool[randomIndex],
    difficulty,
  })
}

module.exports = {
  getRandomParagraph,
}
