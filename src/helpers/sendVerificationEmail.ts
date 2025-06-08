import {resend} from "@/lib/resend";
import VerificationEmail from "@/emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";


// See documentation and make
export async function sendverificationEmail (
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {

        await resend.emails.send({ // copy paste from Resend or React Email
            from: 'you@example.com',
            to: email,
            subject: 'Mystry Message Verification Code',
            react: VerificationEmail({username, verificationCode: verifyCode})
        });
        return {success: true, message: "Verification email sent"};
    } catch (emailError) {
        console.log("Error sending verification email", emailError);
        return {success: false, message: "Error sending verification email"};   
    }
}

