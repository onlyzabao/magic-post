import mongoose from "mongoose";

const StaffSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
        validate: {
            validator: async function (id) {
                const department = await mongoose.model("Department").findById(id);
                return department !== null && department.active === true;
            },
            message: "Invalid 'department' reference."
        }
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    active: {
        type: Boolean,
        required: true
    }
});

export default mongoose.model("Staff", StaffSchema);