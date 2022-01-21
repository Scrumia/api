const Enum = require("adonis-enum");

const SpecialityEnum = new Enum({
  ARCHER: "archer",
  BARBARIAN: "barbarian",
  PALADIN: "paladin",
  ARCANE_MAGE: "arcane mage",
  KNIGHT: "knight",
  GEOMANCER: "geomancer",
  ALCHEMIST: "alchemist",
  BLACK_SMITH: "black smith",
  ENCHANTING: "enchanting",
  MESSENGER: "messenger",
});

export default SpecialityEnum;
