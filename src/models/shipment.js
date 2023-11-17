import mongoose from "mongoose";

const ShipmentSchema = new mongoose.Schema({
    sender: {
        name: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        province: {
            type: String,
            required: true
        },
        district: {
            type: String,
            required: true
        },
        street: {
            type: String,
            required: true
        },
        zipcode: {
            type: String,
            required: true
        }
    },
    receiver: {
        name: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        province: {
            type: String,
            required: true
        },
        district: {
            type: String,
            required: true
        },
        street: {
            type: String,
            required: true
        },
        zipcode: {
            type: String,
            required: true
        }
    },
    meta: {
        type: {
            type: String,
            required: true
        },
        cost: {
            type: Number,
            required: true
        },
        value: {
            type: Number
        },
        weight: {
            type: Number
        },
        note: {
            type: String
        }
    },
    status: {
        type: String,
        required: true
    }
});

export default mongoose.model("Shipment", ShipmentSchema);