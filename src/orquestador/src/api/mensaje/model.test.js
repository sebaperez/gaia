import { Mensaje } from '.'

let mensaje

beforeEach(async () => {
  mensaje = await Mensaje.create({ de: 'test', para: 'test', contenido: 'test', contenidoActual: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = mensaje.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(mensaje.id)
    expect(view.de).toBe(mensaje.de)
    expect(view.para).toBe(mensaje.para)
    expect(view.contenido).toBe(mensaje.contenido)
    expect(view.contenidoActual).toBe(mensaje.contenidoActual)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = mensaje.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(mensaje.id)
    expect(view.de).toBe(mensaje.de)
    expect(view.para).toBe(mensaje.para)
    expect(view.contenido).toBe(mensaje.contenido)
    expect(view.contenidoActual).toBe(mensaje.contenidoActual)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
