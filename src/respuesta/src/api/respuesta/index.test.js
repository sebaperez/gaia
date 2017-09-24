import request from 'supertest-as-promised'
import express from '../../services/express'
import routes, { Respuesta } from '.'

const app = () => express(routes)

let respuesta

beforeEach(async () => {
  respuesta = await Respuesta.create({})
})

test('POST /respuesta 201', async () => {
  const { status, body } = await request(app())
    .post('/')
    .send({ motivo: 'test', contenido: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.motivo).toEqual('test')
  expect(body.contenido).toEqual('test')
})

test('GET /respuesta 200', async () => {
  const { status, body } = await request(app())
    .get('/')
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
})

test('GET /respuesta/:motivo 200', async () => {
  const { status, body } = await request(app())
    .get(`/${respuesta.motivo}`)
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(respuesta.id)
})

test('GET /respuesta/:motivo 404', async () => {
  const { status } = await request(app())
    .get('/123456789098765432123456')
  expect(status).toBe(404)
})

test('PUT /respuesta/:motivo 200', async () => {
  const { status, body } = await request(app())
    .put(`/${respuesta.motivo}`)
    .send({ motivo: 'test', contenido: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(respuesta.id)
  expect(body.motivo).toEqual('test')
  expect(body.contenido).toEqual('test')
})

test('PUT /respuesta/:motivo 404', async () => {
  const { status } = await request(app())
    .put('/123456789098765432123456')
    .send({ motivo: 'test', contenido: 'test' })
  expect(status).toBe(404)
})

test('DELETE /respuesta/:motivo 204', async () => {
  const { status } = await request(app())
    .delete(`/${respuesta.motivo}`)
  expect(status).toBe(204)
})

test('DELETE /respuesta/:motivo 404', async () => {
  const { status } = await request(app())
    .delete('/123456789098765432123456')
  expect(status).toBe(404)
})
