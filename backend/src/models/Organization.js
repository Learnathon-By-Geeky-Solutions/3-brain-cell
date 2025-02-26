const { EntitySchema } = require('typeorm');

const Organization = new EntitySchema({
  name: "Organization",
  tableName: "organizations",
  columns: {
    organization_id: {
      primary: true,
      type: "int",
      generated: true,
    },
    organization_name: {
      type: "varchar",
      nullable: false, 
    },
    type: {
      type: "varchar",
    },
    sector: {
      type: "varchar",
    },
    documentLink: {
      type: "varchar",
    },
    regNo: {
      type: "varchar",
    },
    establishedDate: {
      type: "date",
    },
    mission: {
      type: "text",
    },
    secondaryContactName: {
      type: "varchar",
    },
    secondaryContactTitle: {
      type: "varchar",
    },
    secondaryContactMail: {
      type: "varchar",
    },
    location: {
      type: "varchar",
    },
    website: {
      type: "varchar",
    },
    socialMediaLink: {
      type: "varchar",
    },
    parentOrg: {
      type: "varchar",
    },
    approval_status: {
      type: "boolean",
      default: false,
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

module.exports = Organization;
