import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from "zod";
import {usernameValidation} from "@/schemas/signUpSchema";

// This route checks if a username is unique in the database
// It expects a query parameter `username` and returns a JSON response indicating whether the username is unique or not
// If the username is unique, it returns { success: true, isUnique: true }
// If the username is not unique, it returns { success: false, isUnique: false }
// If the query parameter is missing or invalid, it returns a 400 status with an error message
// If there is a database connection error, it returns a 500 status with an error message
// Import necessary modules and schemas


const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request){

    // Connect to the database
    // This is a utility function that connects to the database
    // It should be called before any database operations
    // This is to ensure that the database connection is established before performing any operations

    await dbConnect();
    // Validate query parameters

    try {
        const {searchParams} = new URL(request.url);
        const queryParam = {
            username: searchParams.get("username")
        }
        // Validate the query parameters against the schema with ZOD
        const parsedQuery = UsernameQuerySchema.safeParse(queryParam);
        if (!parsedQuery.success) {
            const usernameErrors = parsedQuery.error.format().username?._errors || [];
            return new Response(
                JSON.stringify({
                    error: "Invalid query parameters",
                    details: usernameErrors
                }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }
        // Extract the username from the parsed query
        const { username } = parsedQuery.data;
        // Check if the username exists in the database
        const user = await UserModel.findOne({ username, isVerified: true });

        // Return the response based on whether the username is unique or not
        // If the user exists, it means the username is not unique
        // If the user does not exist, it means the username is unique
        if (user) {
            return Response.json({
                success: false,
                message: "Username is already taken",
                isUnique: false
            }, {
                status: 409,
                headers: { "Content-Type": "application/json" }
                
            })
        }
        return Response.json({
                success: true,
                message: "Username is available",
                isUnique: true
            }, {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
    } catch (error) {
        console.error("Database connection error:", error);
        return new Response("Database connection error", { status: 500 });
    }
}