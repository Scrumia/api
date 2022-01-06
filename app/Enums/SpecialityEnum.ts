const Enum = require('adonis-enum')

const SpecialityEnum = new Enum({
    ARCHER: "archer",
    BARBARIC: "barbaric",
    PALADIN: "paladin",
    ARCANE_MAGE: "arcane mage",
    PRIEST: "priest",
    GEOMANCER: "geomancer",
    ALCHEMIST: "alchemist",
    BLACK_SMITH: "black smith",
    ENCHANTING: "enchanting",
    MESSENGER: "messenger"
})

export default SpecialityEnum