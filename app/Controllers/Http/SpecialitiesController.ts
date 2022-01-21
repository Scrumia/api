// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Speciality from "App/Models/Speciality";

export default class SpecialitiesController {
  /**
   * @swagger
   * /specialities:
   *  get:
   *   summary: Get all specialities
   *   description: Get all specialities
   *   security:
   *    - bearerAuth: []
   *   tags:
   *    - Specialities
   *   produces:
   *    - application/json
   *   responses:
   *    200:
   *      description: A list of specialities
   *      content:
   *       application/json:
   *        schema:
   *         type: array
   *         items:
   *          properties:
   *           id:
   *            type: integer
   *            example: 1
   *           name:
   *            type: string
   *            example: "Speciality 1"
   *           created_at:
   *            type: string
   *            example: "2020-01-01 00:00:00"
   *           updated_at:
   *            type: string
   *            example: "2020-01-01 00:00:00"
   *
   */
  public async index() {
    return await Speciality.all();
  }
}
