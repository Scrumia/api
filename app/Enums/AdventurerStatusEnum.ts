const Enum = require('adonis-enum')

const AdventurerStatusEnum = new Enum({
    AVAILABLE: "available",
    REST: "rest",
    WORK: "work"
})

export default AdventurerStatusEnum