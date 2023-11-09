import mongoose from "mongoose";
import mongooseLong from 'mongoose-long';
import systemConfig from "config";

const mongoConnect = () => {
    mongoose.connect(systemConfig.get("database.url"),systemConfig.get("database.options"));
    mongooseLong(mongoose); // INT 64bit
    const databaseTest = mongoose.connection;
    
    databaseTest.on('error', (error) => {
        console.log("errorDB", error)
    })
    
    databaseTest.once('connected', () => {
        console.log('Database Connected');
    })
}
export default mongoConnect;