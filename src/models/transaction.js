import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
    shipment: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Shipment"
    },
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        // required: true
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