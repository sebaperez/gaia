import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { create, index, show, update, destroy, parser } from './controller'
import { schema } from './model'
export Respuesta, { schema } from './model'

const router = new Router()
const { motivo, contenido, owner, hueco } = schema.tree

/**
 * @api {post} /respuesta Create respuesta
 * @apiName CreateRespuesta
 * @apiGroup Respuesta
 * @apiParam title Respuesta's title.
 * @apiParam content Respuesta's content.
 * @apiSuccess {Object} respuesta Respuesta's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Respuesta not found.
 */
router.post('/',
  body({ motivo, contenido }),
  create)

/**
 * @api {get} /respuesta Retrieve respuestas
 * @apiName RetrieveRespuestas
 * @apiGroup Respuesta
 * @apiUse listParams
 * @apiSuccess {Object[]} respuestas List of respuestas.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/',
  query(),
  index)

/**
 * @api {get} /respuesta/:id Retrieve respuesta
 * @apiName RetrieveRespuesta
 * @apiGroup Respuesta
 * @apiSuccess {Object} respuesta Respuesta's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Respuesta not found.
 */
router.get('/:motivo',
  show)

/**
 * @api {put} /respuesta/:id Update respuesta
 * @apiName UpdateRespuesta
 * @apiGroup Respuesta
 * @apiParam motivo Respuesta's motivo.
 * @apiParam contenido Respuesta's contenido.
 * @apiSuccess {Object} respuesta Respuesta's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Respuesta not found.
 */
router.put('/:motivo',
  body({ motivo, contenido }),
  update)

/**
 * @api {delete} /respuesta/:id Delete respuesta
 * @apiName DeleteRespuesta
 * @apiGroup Respuesta
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Respuesta not found.
 */
router.delete('/:motivo',
  destroy)

/**
 * @api {post} /respuesta/:motivo/parser Parser respuesta
 * @apiName ParserRespuesta
 * @apiGroup Respuesta
 * @apiParam parametros Respuesta's parametros.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Respuesta not found.
 */
router.post('/:motivo/parser',
  body({ owner, hueco }),
  parser)

export default router
