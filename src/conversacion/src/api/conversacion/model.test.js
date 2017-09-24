import { Conversacion } from '.'

let conversacion

beforeEach(async () => {
  conversacion = await Conversacion.create({ owner: 'test', guest: 'test', mensajes: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = conversacion.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(conversacion.id)
    expect(view.owner).toBe(conversacion.owner)
    expect(view.guest).toBe(conversacion.guest)
    expect(view.mensajes).toBe(conversacion.mensajes)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = conversacion.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(conversacion.id)
    expect(view.owner).toBe(conversacion.owner)
    expect(view.guest).toBe(conversacion.guest)
    expect(view.mensajes).toBe(conversacion.mensajes)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
