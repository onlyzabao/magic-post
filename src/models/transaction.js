import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    shipment: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Shipment",
        validate: {
            validator: async function (id) {
                const shipment = await mongoose.model("Shipment").findById(id);
                return shipment !== null;
            },
            message: "Invalid 'shipment' reference."
        }
    },
    sender: {
        type: String,
        validate: {
            validator: async function (username) {
                const staff = await mongoose.model("Staff").find({ username: username });
                return staff !== null;
            },
            message: "Invalid 'sender' reference."
        }
    },
    receiver: {
        type: String,
        validate: {
            validator: async function (username) {
                const staff = await mongoose.model("Staff").find({ username: username });
                return staff !== null;
            },
            message: "Invalid 'receiver' reference."
        }
    },
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date
    },
    pos: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
        validate: {
            validator: async function (id) {
                const department = await mongoose.model("Department").findById(id);
                return department !== null && department.active;
            },
            message: "Invalid 'pos' reference."
        }
    },
    des: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
        validate: {
            validator: async function (id) {
                const department = await mongoose.model("Department").findById(id);
                return department !== null && department.active;
            },
            message: "Invalid 'des' reference."
        }
    },
    status: {
        type: String,
        required: true
    }
});

export default mongoose.model("Transaction", TransactionSchema);
