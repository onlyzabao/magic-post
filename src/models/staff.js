// import mongoose from "mongoose";
// import role from "../constants/role";
// let Schema = new mongoose.Schema({
// 	uuid: {
// 		type: String,
// 		required: true,
// 		unique: true
// 	},
// 	username: {
// 		type: String,
// 		required: true,
// 		unique: true
// 	},
// 	password: {
// 		type: String,
// 		hide: true
// 	},
// 	role: {
// 		type: String,
// 		required: true,
// 		default: () => role.USER
// 	},
// });


// export default mongoose.model('Users', Schema);

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
        ref: "Department"
    },
    name: {
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
    }
});

export default mongoose.model("Staff", StaffSchema);