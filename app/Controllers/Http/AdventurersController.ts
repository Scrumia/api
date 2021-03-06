// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Adventurer from "App/Models/Adventurer";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import AdventurerStatusEnum from "App/Enums/AdventurerStatusEnum";
import UpdateAdventurerValidator from "App/Validators/UpdateAdventurerValidator";
import CreateAdventurerValidator from "App/Validators/CreateAdventurerValidator";

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
   *   - Adventurers
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
   *      description: The id of the adventurer
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
      .where("id", params.adventurerId)
      .first();

    if (!adventurer) {
      return response.status(404).send({ error: "Adventurer not found" });
    }

    if (adventurer.status !== AdventurerStatusEnum.AVAILABLE.value) {
      return response.status(400).send({
        error: "Can not delete an adventurer in work status or rest status",
      });
    }

    await adventurer.delete();

    return response.status(204);
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
    const adventurer = await Adventurer.find(params.adventurerId);
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

  /**
   * @swagger
   * /adventurers:
   *  post:
   *   tags:
   *   - Adventurers
   *   summary: Create a new adventurer
   *   description: Allow to create a new adventurer
   *   security:
   *    - bearerAuth: []
   *   requestBody:
   *    required: true
   *    content:
   *      application/json:
   *       schema:
   *        type: object
   *        properties:
   *         experience_level:
   *          type: integer
   *          example: 32
   *         speciality_id:
   *          type: integer
   *          example: 32
   *         fullName:
   *          type: string
   *          example: Didier le tron??onneur
   *   responses:
   *    '201':
   *      description: A successful response
   *    '422':
   *     description: Unprocessable entity
   */
  public async store({ request, response }: HttpContextContract) {
    const newAdventurerValidated = await request.validate(
      CreateAdventurerValidator
    );
    await Adventurer.create(newAdventurerValidated);

    return response.status(201);
  }
}
