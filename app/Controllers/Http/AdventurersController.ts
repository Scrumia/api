// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Adventurer from "App/Models/Adventurer";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import UpdateAdventurerValidator from 'App/Validators/UpdateAdventurerValidator';

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

  /**
   * @swagger
   * /adventurers/{adventurerId}:
   *  get:
   *   tags:
   *   - Adventurers
   *   summary: Get adventurer by ID
   *   description: Get adventurer by ID
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
  public async show({ params, response }: HttpContextContract) {
    const adventurer = await Adventurer.query()
      .where("id", params.adventurerId)
      .preload("speciality")
      .first();

    if (!adventurer) {
      return response.status(404).send({ error: "Adventurer not found" });
    }

    return adventurer;
  }





 /**
   * @swagger
   * /adventurers/{adventurerId}:
   *  put:
   *   tags:
   *   - Adventurers
   *   summary: Update adventurer by ID
   *   description: Allow to update an adventurer's informations (found by ID)
   *   security:
   *    - bearerAuth: []
   *   requestBody:
   *    required: true
   *    content:
   *      application/json:
   *       schema:
   *        type: object
   *        properties:
   *         full_name:
   *           type: string
   *           example: "John Doe"
   *         experience_level:
   *           type: integer
   *           example: 1.0
   *         speciality_id:
   *           type: integer
   *           example: 1
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
  public async update({ request, response, params }: HttpContextContract) {
    const adventurer = await Adventurer.find(params.adventurerId)
    if (!adventurer) {
      return response.status(404).send({ error: "Adventurer not found" });
    }
    const updatedAdventurerValidated = await request.validate(
    UpdateAdventurerValidator
    );

    return await Adventurer.updateOrCreate(
      { id: params.adventurerId },
      updatedAdventurerValidated
    );
  }
}
