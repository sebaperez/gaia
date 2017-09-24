import request from 'supertest-as-promised'
import express from '../../services/express'
import routes, { Conversacion } from '.'

const app = () => express(routes)

let conversacion

beforeEach(async () => {
  conversacion = await Conversacion.create({})
})

test('POST /conversacion 201', async () => {
  const { status, body } = await request(app())
    .post('/')
    .send({ owner: 'test', guest: 'test', mensajes: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.owner).toEqual('test')
  expect(body.guest).toEqual('test')
  expect(body.mensajes).toEqual('test')
})

test('GET /conversacion 200', async () => {
  const { status, body } = await request(app())
    .get('/')
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
})

test('GET /conversacion/:id 200', async () => {
  const { status, body } = await request(app())
    .get(`/${conversacion.id}`)
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(conversacion.id)
})

test('GET /conversacion/:id 404', async () => {
  const { status } = await request(app())
    .get('/123456789098765432123456')
  expect(status).toBe(404)
})

test('PUT /conversacion/:id 200', async () => {
  const { status, body } = await request(app())
    .put(`/${conversacion.id}`)
    .send({ owner: 'test', guest: 'test', mensajes: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(conversacion.id)
  expect(body.owner).toEqual('test')
  expect(body.guest).toEqual('test')
  expect(body.mensajes).toEqual('test')
})

test('PUT /conversacion/:id 404', async () => {
  const { status } = await request(app())
    .put('/123456789098765432123456')
    .send({ owner: 'test', guest: 'test', mensajes: 'test' })
  expect(status).toBe(404)
})

test('DELETE /conversacion/:id 204', async () => {
  const { status } = await request(app())
    .delete(`/${conversacion.id}`)
  expect(status).toBe(204)
})

test('DELETE /conversacion/:id 404', async () => {
  const { status } = await request(app())
    .delete('/123456789098765432123456')
  expect(status).toBe(404)
})
