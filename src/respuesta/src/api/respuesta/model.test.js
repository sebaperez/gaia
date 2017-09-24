import { Respuesta } from '.'

let respuesta

beforeEach(async () => {
  respuesta = await Respuesta.create({ motivo: 'test', contenido: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = respuesta.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(respuesta.id)
    expect(view.motivo).toBe(respuesta.motivo)
    expect(view.contenido).toBe(respuesta.contenido)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = respuesta.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(respuesta.id)
    expect(view.motivo).toBe(respuesta.motivo)
    expect(view.contenido).toBe(respuesta.contenido)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
