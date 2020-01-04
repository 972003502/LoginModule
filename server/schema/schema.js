/* define Mongoose schema */
const schema = {
  hero: {
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },

  userInfo: {
    email: {
      type: String,
      required: true,
      validate: {
        validator: function (val) {
          return /^[a-z,A-Z,0-9]+@[a-z,A-Z]+.[a-z,A-Z]+$/.test(val);
        },
        message: '{VALUE} is not a valid E-mail!'
      },
      unique: true
    },
    nickname: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    phoneNumber: {
      type: String,
      required: true
    },
    salt: {
      type: String,
      required: true
    }
  }
}

module.exports = schema;
