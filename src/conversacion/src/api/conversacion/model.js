import mongoose, { Schema } from 'mongoose'

const conversacionSchema = new Schema({
  owner: {
    type: String
  },
  guest: {
    type: String
  },
  mensajes: [ {
    type: Object
  } ]
}, {
  timestamps: true
})

conversacionSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      owner: this.owner,
      guest: this.guest,
      mensajes: this.mensajes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Conversacion', conversacionSchema)

export const schema = model.schema
export default model
