import mongoose, { Schema } from 'mongoose'

const mensajeSchema = new Schema({
  de: {
    type: String
  },
  para: {
    type: String
  },
  contenido: {
    type: String
  },
  contenidoActual: {
    type: String
  }
}, {
  timestamps: true
})

mensajeSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      de: this.de,
      para: this.para,
      contenido: this.contenido,
      contenidoActual: this.contenidoActual,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Mensaje', mensajeSchema)

export const schema = model.schema
export default model
