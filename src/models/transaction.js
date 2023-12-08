import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
    shipment: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Shipment"
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Staff"
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Staff"
    },
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date
    },
    pos: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    des: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    status: {
        type: String,
        required: true
    }
});

export default mongoose.model("Transaction", TransactionSchema);