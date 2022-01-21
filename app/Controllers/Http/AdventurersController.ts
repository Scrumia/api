// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Adventurer from "App/Models/Adventurer";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import AdventurerStatusEnum from "App/Enums/AdventurerStatusEnum";

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
   *  delete:
   *   tags:
   *   - Requests
   *   summary: Delete an adventurer
   *   description: Allow to delete an adventurer
   *   security:
   *    - bearerAuth: []
   *   parameters:
   *    - in: path
   *      name: adventurerId
   *      schema:
   *       type: integer
   *      required: true
   *      description: The id of the adbventurer
   *   responses:
   *    '204':
   *      description: A successful response
   *    '404':
   *      description: Adventurer not found
   *    '400':
   *      description: Can not delete an adventurer in work status
   */
  public async delete({ params, response }: HttpContextContract) {
    const adventurer = await Adventurer.query()
      .where("id", params.id)
      .first();

    if (!adventurer) {
      return response.status(404).send({ error: "Adventurer not found" });
    }

    if (adventurer.status !== AdventurerStatusEnum.WORK.value) {
      return response
        .status(400)
        .send({ error: "Can not delete an adventurer in work status" });
    }

    await adventurer.delete();

    return response.status(204);
  }
}
