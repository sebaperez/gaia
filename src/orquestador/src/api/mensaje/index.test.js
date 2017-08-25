import request from 'supertest-as-promised'
import express from '../../services/express'
import routes, { Mensaje } from '.'

const app = () => express(routes)

let mensaje

beforeEach(async () => {
  mensaje = await Mensaje.create({})
})

test('POST /mensajes 201', async () => {
  const { status, body } = await request(app())
    .post('/')
    .send({ de: 'test', para: 'test', contenido: 'test', contenidoActual: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.de).toEqual('test')
  expect(body.para).toEqual('test')
  expect(body.contenido).toEqual('test')
  expect(body.contenidoActual).toEqual('test')
})
