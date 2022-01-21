// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Adventurer from "App/Models/Adventurer";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
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
   * /requests:
   *  post:
   *   tags:
   *   - Requests
   *   summary: Create a new request
   *   description: Allow to create a new request
   *   security:
   *    - bearerAuth: []
   *   requestBody:
   *    required: true
   *    content:
   *      application/json:
   *       schema:
   *        type: object
   *        properties:
   *         id:
   *          type: integer
   *          example: 1
   *         name:
   *          type: string
   *          example: Conquête d'un territoire isolé
   *         description:
   *          type: string
   *          example: Nous recherchons des aventuriers capables d'assurer la conquête d'un territoire isolé.
   *         bounty:
   *          type: integer
   *          example: 100
   *         status:
   *          type: string
   *          example: started
   *         client_name:
   *          type: string
   *          example: "John Doe"
   *         started_at:
   *          type: date
   *          example: 2020-04-01 00:00:00
   *         duration:
   *          type: integer
   *          example: 3
   *         created_at:
   *          type: string
   *          example: "2020-05-06T14:00:00.000Z"
   *         updated_at:
   *          type: string
   *          example: "2020-05-06T14:00:00.000Z"
   *         expiration_date:
   *          type: date
   *          example: 2020-03-01 00:00:00
   *   responses:
   *    '201':
   *      description: A successful response
   *    '422':
   *     description: Unprocessable entity
   */
     public async store({ request, response }: HttpContextContract) {
      const newAdventurerValidated = await request.validate(CreateAdventurerValidator);
      await Adventurer.create(newAdventurerValidated);
  
      return response.status(201);
    }
}
