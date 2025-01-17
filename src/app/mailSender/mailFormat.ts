export const resetPasswordVarificationMessage = (verificationCode:number) => {
    return ` <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #4caf50;">Password Reset Verification</h2>
                <p>We received a request to reset your password. Use the code below to complete the process:</p>
                <div style="font-size: 24px; font-weight: bold; background: #f4f4f4; padding: 15px; text-align: center; margin: 20px auto; border-radius: 5px; letter-spacing: 3px;">
                    ${verificationCode}
                </div>
                <p>This code is valid for the next 30 minutes. If you did not request this, please ignore this email.</p>
                <p>Thanks,<br>The Jotter Team</p>
            </div>`
}