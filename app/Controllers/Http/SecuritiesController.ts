import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class SecuritiesController {
  public async login({ request, auth }: HttpContextContract) {
    const email = request.input("email");
    const password = request.input("password");

    const token = auth.attempt(email, password);
    return token;
  }

  public async logout({ auth }: HttpContextContract) {
    await auth.use("api").revoke();

    return {
      revoked: true,
    };
  }
}
