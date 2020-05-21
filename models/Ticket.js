const mongoose = require('mongoose');
const { Schema } = mongoose;

const ticketSchema = new Schema({
    status: {
        type: String,
        required: [true, "The status has to be defined"],
        enum: ["Open", "ClosingRequested", "Closed"],
        default: "Open"
    },
    tenant: {
        type: Schema.Types.ObjectId,
        ref: "Tenant",
        required: [true, "The tenant has to be defined"]
    },
    clientUser: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "A client user must be specified"]
    },
    issueDescription: {
        type: String,
        required: [true, "An issue description has to be supplied"],
        minlength: [50, "A desciption must be more detailed"]
    },
    device: {
        type: Schema.Types.ObjectId,
        ref: "Device",
        required: false
    },
    reportDate: {
        type: Schema.Types.Date,
        required: [true, "A report day must be specified"]
    },
    tecnicianUser: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
    assigmentDate: {
        type: Schema.Types.Date,
        required: false
    },
    activities: [{
        date: {
            type: Schema.Types.Date,
            required: [true, "A date for the activity has to be specified"]
        },
        activity: {
            type: String,
            required: [true, "A description of the activity has to be especified"]
        }
    }],
    internalNotes: {
        type: String,
        required: false
    },
    closedDate: {
        type: Schema.Types.Date,
        required: false
    },
    clientComments: {
        type: String,
        required: false
    }
}, { timestamps: true });


module.exports = mongoose.model("Ticket", ticketSchema);