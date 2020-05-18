const mongoose = require("mongoose");

const { Schema } = mongoose;

// Validation using 2 fields:
// https://stackoverflow.com/questions/23760253/mongoose-custom-validation-using-2-fields
// Note that function call in validate doesn't require param
const deviceCode = {
  code: {
    type: String,
    required: [true, "You shoud specify a code for this device"],
  },
  tenant: {
    type: Schema.Types.ObjectId,
    ref: "Tenant",
    required: [true, "A valid Tenant must be specified"],
  },
};

async function checkUniqueness(aDeviceCode) {
  const { code, tenant } = aDeviceCode;
  const items = await mongoose.model("Device").find({
    "deviceCode.code": code,
    "deviceCode.tenant": tenant,
  }).count();
  return items === 0;
}

const deviceSchema = new Schema(
  {
    deviceCode: {
        type: deviceCode,
        validate: {
            message: "This code already exists for this tenant.",
            validator: checkUniqueness
        } 
    },
    name: {
      type: String,
      required: [true, "A name for the user is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Device", deviceSchema);
