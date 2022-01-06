// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Adventurer from "App/Models/Adventurer";

export default class AdventurersController {
  /**
   * @swagger
   * /adventurers:
   *  get:
   *   tags:
   *   - Adventurers
   *   summary: List of all adventurers
   *   description: List of all adventurers
   *   security:
   *    - bearerAuth: []
   *   responses:
   *    '200':
   *      description: A successful response
   *      content:
   *        application/json:
   *          schema:
   *            type: array
   *            items:
   *             type: object
   *             properties:
   *              id:
   *               type: integer
   *               example: 1
   *              full_name:
   *               type: string
   *               example: "John Doe"
   *              experience_level:
   *                type: integer
   *                example: 1.0
   *              created_at:
   *                type: string
   *                example: "2020-05-06T14:00:00.000Z"
   *              updated_at:
   *                type: string
   *                example: "2020-05-06T14:00:00.000Z"
   *              speciality:
   *               type: object
   *               properties:
   *                id:
   *                 type: integer
   *                 example: 1
   *                name:
   *                 type: string
   *                 example: "Fighter"
   *                created_at:
   *                 type: string
   *                 example: "2020-05-06T14:00:00.000Z"
   *                updated_at:
   *                 type: string
   *                 example: "2020-05-06T14:00:00.000Z"
   */
  public async index() {
    return await Adventurer.query().preload("speciality");
  }
}
