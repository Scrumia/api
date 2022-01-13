import AdventurerStatusEnum from "App/Enums/AdventurerStatusEnum";
import RequestStatusEnum from "App/Enums/RequestStatusEnum";
import Request from "App/Models/Request";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import RequestAdventurer from "App/Models/RequestAdventurer";

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
   *
   *
   *
   *    '400':
   *     description: No requests found
   */
  public async requestId({ params, response }: HttpContextContract) {
    const requestId = params.requestId;
    const request = await Request.findBy("id", requestId);
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

    await RequestAdventurer.query()
      .where("request_id", requestId)
      .where("adventurer_id", adventurerId)
      .delete();

    request.adventurers[0].status = AdventurerStatusEnum.AVAILABLE.value;
    await request.adventurers[0].save();

    return response.status(204);
  }
}
