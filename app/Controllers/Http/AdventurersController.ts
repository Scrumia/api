// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Adventurer from "App/Models/Adventurer"

export default class AdventurersController {
    public async index() {
        return await Adventurer.query().preload("speciality")
    }
}
