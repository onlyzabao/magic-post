import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    value: {
        type: Number,
        required: true
    }
});

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
        start: {
            type: Date,
            required: true
        },
        end: {
            type: Date,
        },
        item: [ItemSchema],
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