const { EntitySchema } = require('typeorm');

const Volunteer = new EntitySchema({
  name: "Volunteer",
  tableName: "volunteers",
  columns: {
    volunteer_id: {
      primary: true,
      type: "int",
      generated: true,
    },
    skills: {
      type: "text",
      array: true,
    },
    work_location: {
      type: "varchar",
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

module.exports = Volunteer;
