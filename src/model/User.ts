import mongoose, {Schema, Document} from "mongoose";


export interface Message extends Document {
    content: string;
    createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true, 
        default: Date.now
    }
})

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Please provide a username"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        , "Please provide a valid email"],
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: [6, "Password must be at least 6 characters long"]
    },
    verifyCode: {
        type: String,
        required: [true, "Please provide a verify code"],
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "Please provide a verify code expiry"],
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true
    },
    messages: [MessageSchema] // Important
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema); // important

export default UserModel


