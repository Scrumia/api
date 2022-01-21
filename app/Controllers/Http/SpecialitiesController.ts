// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Speciality from "App/Models/Speciality";

export default class SpecialitiesController {
  public async index() {
    return await Speciality.all();
  }
}
