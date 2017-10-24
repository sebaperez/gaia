import _ from 'lodash'
import { success, notFound } from '../../services/response/'
import { Conversacion } from '.'

export const create = ({ bodymen: { body } }, res, next) =>
  Conversacion.create(body)
    .then((conversacion) => conversacion.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Conversacion.find(query, select, cursor)
    .then((conversacions) => conversacions.map((conversacion) => conversacion.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Conversacion.findOne({ owner: params.owner,  guest: params.guest })
    .then(notFound(res))
    .then((conversacion) => conversacion ? conversacion.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ bodymen: { body }, params }, res, next) =>
  Conversacion.findById(params.id)
    .then(notFound(res))
    .then((conversacion) => conversacion ? actualizarMensajes(conversacion, body).save() : null)
    .then((conversacion) => conversacion ? conversacion.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ params }, res, next) =>
  Conversacion.findById(params.id)
    .then(notFound(res))
    .then((conversacion) => conversacion ? conversacion.remove() : null)
    .then(success(res, 204))
    .catch(next)

function actualizarMensajes(conversacion, nuevaConversacion) {
   conversacion.mensajes = nuevaConversacion.mensajes
   return conversacion
}
