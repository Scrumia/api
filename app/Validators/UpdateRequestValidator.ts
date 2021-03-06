import { schema, rules } from "@ioc:Adonis/Core/Validator";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import RequestStatusEnum from "App/Enums/RequestStatusEnum";

export default class UpdateRequestValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    name: schema.string({ trim: true }, [rules.maxLength(120)]),
    description: schema.string({ trim: true }, [rules.maxLength(500)]),
    client_name: schema.string({ trim: true }, [rules.maxLength(50)]),
    started_at: schema.date({ format: "yyyy-MM-dd HH:mm:ss" }, [
      rules.after("today"),
    ]),
    bounty: schema.number([rules.range(0, 100000)]),
    duration: schema.number([rules.range(0, 365)]),
    expiration_date: schema.date({ format: "yyyy-MM-dd HH:mm:ss" }, [
      rules.after("today"),
    ]),
    status: schema.enum(RequestStatusEnum.valuesString.split(",")),
  });

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages = {};
}
