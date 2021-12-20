import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import swagger from "Config/swagger";

export default class SecuritiesController {
  /**
   * @swagger
   * /login:
   *  post:
   *   tags:
   *   - Securities
   *   summary: Login and get a token
   *   description: Login and get a token
   *   requestBody:
   *    required: true
   *    content:
   *     application/json:
   *      schema:
   *        type: object
   *        properties:
   *          email:
   *            type: string
   *            example: test@test.com
   *          password:
   *            type: string
   *            example: p@ssw0rd
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
  public async login({ request, auth }: HttpContextContract) {
    const email = request.input("email");
    const password = request.input("password");

    const token = auth.attempt(email, password);
    return token;
  }

  /**
   * @swagger
   * /logout:
   *  post:
   *    tags:
   *    - Securities
   *    summary: Logout and invalidate the token
   *    description: Logout and invalidate the token
   *    security:
   *      - bearerAuth: []
   *    responses:
   *      '200':
   *        description: User logged out successfully and token invalidated
   *      '401':
   *        description: Unauthorized
   */
  public async logout({ auth }: HttpContextContract) {
    await auth.use("api").revoke();

    return {
      revoked: true,
    };
  }
}
