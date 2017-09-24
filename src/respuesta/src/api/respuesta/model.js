import mongoose, { Schema } from 'mongoose'

const respuestaSchema = new Schema({
  motivo: {
    type: String
  },
  contenido: {
    type: String
  }
}, {
  timestamps: true
})

respuestaSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      motivo: this.motivo,
      contenido: this.contenido,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Respuesta', respuestaSchema)

export const schema = model.schema
export default model
