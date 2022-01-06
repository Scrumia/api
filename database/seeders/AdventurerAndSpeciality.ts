import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import AdventurerStatusEnum from "App/Enums/AdventurerStatusEnum";
import SpecialityEnum from "App/Enums/SpecialityEnum";
import Adventurer from "App/Models/Adventurer";
import Speciality from "App/Models/Speciality";

import Faker from "faker";

export default class AdventurerAndSpeciality extends BaseSeeder {
  public async run() {
    for (const speciality of SpecialityEnum.valuesString.split(",")) {
      await Speciality.updateOrCreate(
        { name: speciality },
        {
          name: speciality,
        }
      );
    }

    const specialities = await Speciality.all();
    const specialitiesIds = specialities.map((speciality) => speciality.id);

    const adventurers = await Adventurer.all();

    if (adventurers.length === 10) {
      return;
    }

    for (let i = 0; i < 10; i++) {
      await Adventurer.create({
        fullName: `${Faker.name.firstName()} ${Faker.name.lastName()}`,
        experienceLevel: Faker.datatype.number({ min: 1, max: 100 }),
        status: Faker.random.arrayElement(
          AdventurerStatusEnum.valuesString.split(",")
        ),
        specialityId: Faker.random.arrayElement(specialitiesIds),
      });
    }
  }
}
