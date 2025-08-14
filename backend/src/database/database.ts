import mongoose from 'mongoose'
import { config } from '../config/app.config'

const connectDB = async () => {
    try {
        await mongoose.connect(config.MONGO_URI);
        console.log('Connect to DB')
    } catch (error) {
        console.log('Failed to Connect DB')
        process.exit(1)
        
    }
}

export default connectDB;