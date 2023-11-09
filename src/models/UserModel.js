import mongoose from "mongoose";
import role from "./../constants/role";
let Schema = new mongoose.Schema({
	uuid: {
		type: String,
		required: true,
		unique: true
	},
	username: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		hide: true
	},
	role: {
		type: String,
		required: true,
		default: () => role.USER
	},
});


export default mongoose.model('Users', Schema);