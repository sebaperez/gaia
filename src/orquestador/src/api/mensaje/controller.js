import _ from 'lodash'
import { success, notFound } from '../../services/response/'
import { Mensaje } from '.'

export const create = ({ bodymen: { body } }, res, next) =>
  Mensaje.create(body)
    .then((mensaje) => mensaje.view(true))
    .then(success(res, 201))
    .catch(next)
