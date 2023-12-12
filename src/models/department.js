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
    phone: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    cfs: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
        validate: {
            validator: async function (id) {
                const department = await mongoose.model("Department").findById(id);
                return department !== null && department.active && department.type === "STORAGE" && this.zipcode !== undefined;
            },
            message: "Invalid 'department' reference."
        }
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