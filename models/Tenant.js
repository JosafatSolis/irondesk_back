const mongoose = require('mongoose');

const { Schema } = mongoose;

const tenantSchema = new Schema({
    code: {
        type: String,
        required: [true, "You shoud specify a Tenant code"],
        validate: {
            message: "This code is already in use",
            validator: async (code) => {
                const items = await mongoose.model("Tenant").count({ code });
                return items === 0;
            }
        }
    },
    name: {
        type: String,
        required: [true, "A name for the Tenant is required"]
    }
}, {timestamps: true})

module.exports = mongoose.model("Tenant", tenantSchema);