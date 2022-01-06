// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Adventurer from "App/Models/Adventurer"

export default class AdventurersController {

    /**
   * @swagger
   * /index:
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
   *            type: object
   *            properties:
   *              "type":
   *                type: string
   *                example: bearer
   *              token:
   *                type: string
   *                example: epfkemkefmfe
   *    '400':
   *     description: User not found
   */
    public async index() {
        return await Adventurer.query().preload("speciality")
    }
}
