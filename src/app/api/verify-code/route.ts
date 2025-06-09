import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
import { success } from "zod/v4";

// This route verifies a user's code
// It expects a query parameter `code` and returns a JSON response indicating whether the code is valid or not

export async function POST(request: Request) {
    await dbConnect();

    try {
        const {username, code} = await request.json()

        // Validate the input data
        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({ username: decodedUsername, isVerified: false });
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found or already verified."
            }, {
                status: 404
            });
        }

        // Check if the code matches
        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = user.verifyCodeExpiry && new Date(user.verifyCodeExpiry) > new Date();

        if (isCodeValid && isCodeNotExpired) {
            // Update the user's verification status
            user.isVerified = true;
            await user.save();

            return Response.json({
                success: true,
                message: "User verified successfully."
            }, {
                status: 200
            });
        }
        else if(!isCodeNotExpired) {
            return Response.json({
                success: false,
                message: "Verification code has expired, please request a new one."
            }, {
                status: 400
            });
        }
        else {
            return Response.json({
                success: false,
                message: "Invalid verification code."
            }, {
                status: 400
            });
        }

    } catch (error) {
        console.error("Error in verify-code route:", error);
        return Response.json({
            success: false,
            message: "An error occurred while verifying the code."
        }, {
            status: 500
        })
    }
}