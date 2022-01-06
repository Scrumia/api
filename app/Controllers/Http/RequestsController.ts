import Request from "App/Models/Request";
export default class RequestsController {
  /**
   * @swagger
   * /requests:
   *  get:
   *   tags:
   *   - Requests
   *   summary: Get all existing requests
   *   description: Allow to get all existing requests
   *   requestBody:
   *    required: false
   *    content:
   *     application/json:
   *      schema:
   *        type: object
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
   *                "created_at":
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
   *
   *    '400':
   *     description: No requests found
   */
  public async index() {
    const requests = await Request.query().preload("adventurers");
    return requests;
  }
}
