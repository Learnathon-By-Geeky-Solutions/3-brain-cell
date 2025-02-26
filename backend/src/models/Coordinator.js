const { EntitySchema } = require('typeorm');

const Coordinator = new EntitySchema({
  name: "Coordinator",
  tableName: "coordinator",
  columns: {
    coordinator_id: {
      primary: true,
      type: "int",
      generated: true,
    },
    disasterid: {
      type: "int",
    },
  },
  relations: {
    user: {
      target: "User",
      type: "one-to-one",
      joinColumn: true,
    },
  },
});

module.exports = Coordinator;
