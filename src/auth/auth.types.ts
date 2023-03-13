export interface VerifyOTPRequest {
    userId: string
    otp: string
}

export interface GenerateOTPRequest {
    signature: string
    address: string
    name: string
}