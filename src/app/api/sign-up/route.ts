import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendverificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const {username, email, password} = await request.json(); // always use await in next.js
        // Check if user already exists
        const existingUserVerifiedByusername = await UserModel.findOne({
            username,
            isVerified: true
        })

        if(existingUserVerifiedByusername) {
            return Response.json({ success: false, message: "Username already exists" }, { status: 400 });
        }

        const existingUserVerifiedByEmail = await UserModel.findOne({
            email
        })
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if(existingUserVerifiedByEmail) {
            if(existingUserVerifiedByEmail.isVerified) {
                return Response.json({ success: false, message: "Email already exists" }, { status: 400 });
            }
            else{
                const hashedPassword = await bcrypt.hash(password, 10);
                const expiryDate = new Date();
                expiryDate.setHours(expiryDate.getHours() + 1); // 1 Hours
                existingUserVerifiedByEmail.password = hashedPassword;
                existingUserVerifiedByEmail.verifyCode = verifyCode;
                existingUserVerifiedByEmail.verifyCodeExpiry = expiryDate;

                await existingUserVerifiedByEmail.save();
            }
        }
        else{
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1); // 1 Hours

            // Create a new user
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            });

            // Save the user to the database
            await newUser.save();
        }
        // Send verification email
        const emailResponse = await sendverificationEmail(email, username, verifyCode);

        if(!emailResponse.success) {
            return Response.json({ success: false, message: emailResponse.message }, { status: 500 });
        }
        return Response.json({ success: true, message: "User Registered succesfully. Please verify your email" }, { status: 201 });

    } catch (error) {
        console.log("Error Registering User", error);
        return Response.json({ success: false, message: "Error Registering User" }, { status: 500 });    
    }
}