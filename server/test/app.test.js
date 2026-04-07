const assert = require('node:assert/strict')
const test = require('node:test')
const request = require('supertest')

const app = require('../index')

test('GET /api/health returns ok', async () => {
  const response = await request(app).get('/api/health')

  assert.equal(response.statusCode, 200)
  assert.deepEqual(response.body, { status: 'ok' })
})

test('GET /api/sentence with explicit difficulty returns expected shape', async () => {
  const response = await request(app).get('/api/sentence?difficulty=easy')

  assert.equal(response.statusCode, 200)
  assert.equal(response.body.difficulty, 'easy')
  assert.equal(typeof response.body.sentence, 'string')
  assert.ok(response.body.sentence.length > 0)
})

test('GET /api/sentence defaults to medium for invalid difficulty', async () => {
  const response = await request(app).get('/api/sentence?difficulty=invalid')

  assert.equal(response.statusCode, 200)
  assert.equal(response.body.difficulty, 'medium')
  assert.equal(typeof response.body.sentence, 'string')
  assert.ok(response.body.sentence.length > 0)
})

test('GET /api/paragraph with explicit difficulty returns expected shape', async () => {
  const response = await request(app).get('/api/paragraph?difficulty=hard')

  assert.equal(response.statusCode, 200)
  assert.equal(response.body.difficulty, 'hard')
  assert.equal(typeof response.body.paragraph, 'string')
  assert.ok(response.body.paragraph.length > 0)
})

test('GET /api/paragraph defaults to medium when difficulty is missing', async () => {
  const response = await request(app).get('/api/paragraph')

  assert.equal(response.statusCode, 200)
  assert.equal(response.body.difficulty, 'medium')
  assert.equal(typeof response.body.paragraph, 'string')
  assert.ok(response.body.paragraph.length > 0)
})
