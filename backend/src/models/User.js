const { EntitySchema } = require('typeorm');

const User = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    userId: {
      primary: true,
      type: "int",
      generated: true,
    },
    name: {
      type: "varchar",
      length: 255,
    },
    email: {
      type: "varchar",
      unique: true,
    },
    mobile: {
      type: "varchar",
    },
    password: {
      type: "varchar"
    },
    location: {
      type: "varchar",
    },
    role: {
      type: 'enum',
      enum: ['visitor', 'volunteer', 'organization', 'coordinator'],
      default: 'visitor',
    },
    emailVerified: {
      type: 'boolean',
      default: false,
    },
    emailVerificationCode: {
      type: 'varchar',
      nullable: true,
    },
    passwordResetToken: {
      type: "varchar", 
      nullable: true 
    },
    passwordResetExpires: { 
      type: "timestamp", 
      nullable: true 
    },
    createdAt: { 
      type: "timestamp", 
      default: () => "CURRENT_TIMESTAMP" 
    }
  },
  relations: {
    organization: {
      target: "Organization",
      type: "many-to-one",
      joinColumn: true,
      nullable: true, 
    },
    volunteer: {
      target: "Volunteer",
      type: "one-to-one",
      inverseSide: "user"
    },
    coordinator: {
      target: "Coordinator",
      type: "one-to-one",
      inverseSide: "user"
    },
  },
});

module.exports = User;
