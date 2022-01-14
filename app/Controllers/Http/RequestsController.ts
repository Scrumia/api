import AdventurerStatusEnum from "App/Enums/AdventurerStatusEnum";
import RequestStatusEnum from "App/Enums/RequestStatusEnum";
import Request from "App/Models/Request";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import CreateRequestValidator from "App/Validators/CreateRequestValidator";
import Adventurer from "App/Models/Adventurer";
import AddAdventurerValidator from "App/Validators/AddAdventurerValidator";
import UpdateRequestValidator from "App/Validators/UpdateRequestValidator";

export default class RequestsController {
  /**
   * @swagger
   * /requests:
   *  get:
   *   tags:
   *   - Requests
   *   summary: List of all requests
   *   description: Allow to get all existing requests
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
   *              properties:
   *                "id":
   *                  type: integer
   *                  example: 1
   *                name:
   *                  type: string
   *                  example: Conquête d'un territoire isolé
   *                description:
   *                  type: string
   *                  example: Nous recherchons des aventuriers capables d'assurer la conquête d'un territoire isolé.
   *                created_at:
   *                  type: date
   *                  example: 2020-01-01 00:00:00
   *                updated_at:
   *                  type: date
   *                  example: 2020-01-01 00:00:00
   *                bounty:
   *                  type: integer
   *                  example: 100
   *                status:
   *                  type: string
   *                  example: finished
   *                duration:
   *                  type: integer
   *                  example: 3
   *                started_at:
   *                 type: date
   *                 example: 2020-01-01 00:00:00
   *                expiration_date:
   *                 type: date
   *                 example: 2020-01-01 00:00:00
   *                adventurers:
   *                  type: array
   *                  items:
   *                   properties:
   *                    id:
   *                     type: integer
   *                     example: 1
   *                    full_name:
   *                     type: string
   *                     example: "John Doe"
   *                    experience_level:
   *                     type: integer
   *                     example: 1.0
   *                    speciality_id:
   *                     type: integer
   *                     example: 1
   *                    created_at:
   *                     type: string
   *                     example: "2020-05-06T14:00:00.000Z"
   *                    updated_at:
   *                     type: string
   *                     example: "2020-05-06T14:00:00.000Z"
   *                    status:
   *                      type: string
   *                      example: "available"
   *
   *
   *    '400':
   *     description: No requests found
   */
  public async index() {
    const requests = await Request.query().preload("adventurers");
    return requests;
  }

  /**
   * @swagger
   * /requests/{requestId}:
   *  get:
   *   tags:
   *   - Requests
   *   summary: Find request by ID
   *   description: Allow to get one request
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
   *              properties:
   *                "id":
   *                  type: integer
   *                  example: 1
   *                name:
   *                  type: string
   *                  example: Conquête d'un territoire isolé
   *                description:
   *                  type: string
   *                  example: Nous recherchons des aventuriers capables d'assurer la conquête d'un territoire isolé.
   *                bounty:
   *                  type: integer
   *                  example: 100
   *                status:
   *                  type: string
   *                  example: finished
   *                duration:
   *                  type: integer
   *                  example: 3
   *                client_name:
   *                  type: string
   *                  example: "John Doe"
   *                started_at:
   *                  type: date
   *                  example: 2020-04-01 00:00:00
   *                expiration_date:
   *                  type: date
   *                  example: 2020-03-01 00:00:00
   *                adventurers:
   *                 type: array
   *                 items:
   *                  properties:
   *                   id:
   *                    type: integer
   *                    example: 1
   *                   full_name:
   *                     type: string
   *                     example: "John Doe"
   *                   experience_level:
   *                     type: integer
   *                     example: 1.0
   *                   speciality_id:
   *                     type: integer
   *                     example: 1
   *                   created_at:
   *                     type: string
   *                     example: "2020-05-06T14:00:00.000Z"
   *                   updated_at:
   *                     type: string
   *                     example: "2020-05-06T14:00:00.000Z"
   *                   status:
   *                     type: string
   *                     example: "available"
   *                   speciality:
   *                     type: object
   *                     properties:
   *                      id:
   *                       type: integer
   *                       example: 1
   *                      name:
   *                       type: string
   *                       example: "Aventure"
   *                      created_at:
   *                       type: string
   *                       example: "2020-05-06T14:00:00.000Z"
   *                      updated_at:
   *                       type: string
   *                       example: "2020-05-06T14:00:00.000Z"
   *
   *
   *    '400':
   *     description: No requests found
   */
  public async show({ params, response }: HttpContextContract) {
    const requestId = params.requestId;
    const request = await Request.query()
      .where("id", requestId)
      .preload("adventurers", (adventurer) => {
        adventurer.preload("speciality");
      })
      .first();
    if (!request) {
      return response.status(404).send({ error: "Request not found" });
    }
    return request;
  }

  /**
   * @swagger
   * /requests/{requestId}/adventurers/{adventurerId}:
   *  delete:
   *   tags:
   *   - Requests
   *   summary: Remove an adventurer from a request
   *   description: Allow to remove an adventurer from a request
   *   security:
   *    - bearerAuth: []
   *   parameters:
   *    - in: path
   *      name: requestId
   *      schema:
   *       type: integer
   *      required: true
   *      description: The id of the request
   *    - in: path
   *      name: adventurerId
   *      schema:
   *       type: integer
   *      required: true
   *      description: The id of the adventurer
   *   responses:
   *    '200':
   *      description: Adventurer removed from request
   *    '400':
   *      description: Request already started or finished and can't be modified
   *    '404':
   *      description: No requests or adventurer found
   *
   */
  public async removeAdventurer({ params, response }: HttpContextContract) {
    const requestId = params.requestId;
    const adventurerId = params.adventurerId;

    const request = await Request.query()
      .where("id", requestId)
      .innerJoin(
        "request_adventurers",
        "request_adventurers.request_id",
        "requests.id"
      )
      .where("request_adventurers.adventurer_id", adventurerId)
      .where("request_adventurers.request_id", requestId)
      .preload("adventurers", (adventurerQuery) => {
        adventurerQuery.where("id", adventurerId);
      })
      .first();

    if (!request) {
      return response
        .status(404)
        .send({ error: "Request or adventurer not found" });
    }

    if (
      request.status === RequestStatusEnum.STARTED.value ||
      request.status === RequestStatusEnum.FINISHED.value
    ) {
      return response.status(400).send({
        error:
          "You can't delete an adventurer : The request already started or finished",
      });
    }

    await request.related("adventurers").detach([adventurerId]);

    const adventurer = await Adventurer.findBy("id", adventurerId);
    if (adventurer) {
      adventurer.status = AdventurerStatusEnum.AVAILABLE.value;
      await adventurer.save();
    }

    return response.status(204);
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
    const newRequestValidated = await request.validate(CreateRequestValidator);
    await Request.create(newRequestValidated);

    return response.status(201);
  }

  /**
   * @swagger
   * /requests/{requestId}/adventurers:
   *  post:
   *   tags:
   *   - Requests
   *   summary: Add an adventurer on a request
   *   description: Allow to add an adventurer on a request
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
   *         adventurers:
   *          type: object
   *          properties:
   *           id:
   *            type: integer
   *            example: 1
   *           full_name:
   *            type: string
   *            example: Sherwood Schinner
   *           experience_level:
   *            type: integer
   *            example: 76
   *           status:
   *            type: string
   *            example: available
   *           speciality_id:
   *            type: integer
   *            example: 10
   *           created_at:
   *            type: string
   *            example: "2020-05-06T14:00:00.000Z"
   *           updated_at:
   *            type: string
   *            example: "2020-05-06T14:00:00.000Z"
   *   parameters:
   *    - in: path
   *      name: requestId
   *      schema:
   *       type: integer
   *      required: true
   *      description: The id of the request
   *   responses:
   *    '200':
   *      description: Adventurer added on request
   *    '400':
   *      description: Adventurer already added | Adventurer not available
   *    '404':
   *      description: Request not found | You can not add an adventurer on a started or finished request
   *
   */
  public async addAdventurer({
    params,
    request,
    response,
  }: HttpContextContract) {
    const currentRequest = await Request.query()
      .where("id", params.requestId)
      .first();

    if (!currentRequest) {
      return response.status(404).send({ error: "Request not found" });
    }

    if (currentRequest.status !== RequestStatusEnum.PENDING.value) {
      return response
        .status(404)
        .send({
          error:
            "You can not add an adventurer on a started or finished request",
        });
    }

    const newAdventurerValidated = await request.validate(
      AddAdventurerValidator
    );

    const isAdventurerAlreadyAdd = await Request.query()
      .innerJoin(
        "request_adventurers",
        "request_adventurers.request_id",
        "requests.id"
      )
      .where(
        "request_adventurers.adventurer_id",
        newAdventurerValidated.adventurer_id
      )
      .where("request_adventurers.request_id", currentRequest.id)
      .where("id", currentRequest.id)
      .first();

    if (isAdventurerAlreadyAdd) {
      return response.status(400).send({ error: "Adventurer already added" });
    }

    const adventurer = await Adventurer.query()
      .where("id", newAdventurerValidated.adventurer_id)
      .where("status", AdventurerStatusEnum.AVAILABLE.value)
      .first();

    if (!adventurer) {
      return response.status(400).send({ error: "Adventurer not available" });
    }

    await currentRequest.related("adventurers").attach([adventurer.id]);

    adventurer.status = AdventurerStatusEnum.WORK.value;
    await adventurer.save();

    return await Request.query()
      .where("id", currentRequest.id)
      .preload("adventurers")
      .first();
  }

  /**
   * @swagger
   * /requests:
   *  put:
   *   tags:
   *   - Requests
   *   summary: Update a request
   *   description: Allow to update a request
   *   security:
   *    - bearerAuth: []
   *   requestBody:
   *    required: true
   *    content:
   *      application/json:
   *       schema:
   *        type: object
   *        properties:
   *         name:
   *          type: string
   *          example: Conquête d'un territoire isolé
   *         description:
   *          type: string
   *          example: Nous recherchons des aventuriers capables d'assurer la conquête d'un territoire isolé.
   *         bounty:
   *          type: integer
   *          example: 100
   *         duration:
   *          type: integer
   *          example: 3
   *         client_name:
   *          type: string
   *          example: "John Doe"
   *         started_at:
   *          type: date
   *          example: 2020-04-01 00:00:00
   *         expiration_date:
   *          type: date
   *          example: 2020-03-01 00:00:00
   *         status:
   *          type: string
   *          example: "started"
   *   responses:
   *    '200':
   *      description: A successful response
   *    '422':
   *     description: Unprocessable entity
   */
  public async update({ request, params }: HttpContextContract) {
    const updatedRequestValidated = await request.validate(
      UpdateRequestValidator
    );
    return await Request.updateOrCreate(
      { id: params.requestId },
      updatedRequestValidated
    );
  }
}
