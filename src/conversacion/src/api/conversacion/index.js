import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { create, index, show, update, destroy } from './controller'
import { schema } from './model'
export Conversacion, { schema } from './model'

const router = new Router()
const { owner, guest, mensajes, abierto } = schema.tree

/**
 * @api {post} /conversacion Create conversacion
 * @apiName CreateConversacion
 * @apiGroup Conversacion
 * @apiParam owner Conversacion's owner.
 * @apiParam guest Conversacion's guest.
 * @apiParam mensajes Conversacion's mensajes.
 * @apiSuccess {Object} conversacion Conversacion's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Conversacion not found.
 */
router.post('/',
  body({ owner, guest, mensajes, abierto }),
  create)

/**
 * @api {get} /conversacion Retrieve conversacions
 * @apiName RetrieveConversacions
 * @apiGroup Conversacion
 * @apiUse listParams
 * @apiSuccess {Object[]} conversacions List of conversacions.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/',
  query(),
  index)

/**
 * @api {get} /conversacion/:id Retrieve conversacion
 * @apiName RetrieveConversacion
 * @apiGroup Conversacion
 * @apiSuccess {Object} conversacion Conversacion's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Conversacion not found.
 */
router.get('/:owner/:guest',
  show)

/**
 * @api {put} /conversacion/:id Update conversacion
 * @apiName UpdateConversacion
 * @apiGroup Conversacion
 * @apiParam owner Conversacion's owner.
 * @apiParam guest Conversacion's guest.
 * @apiParam mensajes Conversacion's mensajes.
 * @apiSuccess {Object} conversacion Conversacion's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Conversacion not found.
 */
router.put('/:id',
  body({ owner, guest, mensajes, abierto }),
  update)

/**
 * @api {delete} /conversacion/:id Delete conversacion
 * @apiName DeleteConversacion
 * @apiGroup Conversacion
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Conversacion not found.
 */
router.delete('/:id',
  destroy)

export default router
