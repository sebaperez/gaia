import _ from 'lodash'
import { success, notFound } from '../../services/response/'
import { Respuesta } from '.'
var parseText = require('../../services/helpers/respuesta.js').parseText;

export const create = ({ bodymen: { body } }, res, next) =>
  Respuesta.create(body)
    .then((respuesta) => respuesta.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Respuesta.find(query, select, cursor)
    .then((respuestas) => respuestas.map((respuesta) => respuesta.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Respuesta.findOne( { motivo: params.motivo } )
    .then(notFound(res))
    .then((respuesta) => respuesta ? respuesta.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ bodymen: { body }, params }, res, next) =>
  Respuesta.findById(params.id)
    .then(notFound(res))
    .then((respuesta) => respuesta ? _.merge(respuesta, body).save() : null)
    .then((respuesta) => respuesta ? respuesta.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ params }, res, next) =>
  Respuesta.findById(params.id)
    .then(notFound(res))
    .then((respuesta) => respuesta ? respuesta.remove() : null)
    .then(success(res, 204))
    .catch(next)

export const parser = ({ bodymen: { body }, params }, res, next) =>
  Respuesta.findOne( { motivo: params.motivo } )
    .then(notFound(res))
	  .then((respuesta) => respuesta ? parseText(respuesta, body) : null)
    .then(success(res))
    .catch(next)
