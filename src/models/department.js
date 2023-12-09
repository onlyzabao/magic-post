import mongoose from "mongoose";

const DepartmentSchema = new mongoose.Schema({
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
    type: {
        type: String,
        required: true
    },
    cfs: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department"
    },
    zipcode: {
        type: String
    },
    active: {
        type: Boolean,
        required: true
    }
});

export default mongoose.model("Department", DepartmentSchema);