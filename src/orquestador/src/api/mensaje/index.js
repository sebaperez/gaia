import { Router } from 'express'
import { middleware as body } from 'bodymen'
import { create } from './controller'
import { schema } from './model'
export Mensaje, { schema } from './model'

const router = new Router()
const { de, para, contenido, contenidoActual } = schema.tree

/**
 * @api {post} /mensajes Create mensaje
 * @apiName CreateMensaje
 * @apiGroup Mensaje
 * @apiParam de Mensaje's de.
 * @apiParam para Mensaje's para.
 * @apiParam contenido Mensaje's contenido.
 * @apiParam contenidoActual Mensaje's contenidoActual.
 * @apiSuccess {Object} mensaje Mensaje's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Mensaje not found.
 */
router.post('/',
  body({ de, para, contenido, contenidoActual }),
  create)

export default router
