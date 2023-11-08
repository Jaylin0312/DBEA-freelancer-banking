import { Layout } from "@/components/layout"
import OtpForm from "@/components/otpForm"

export default function LoanApplication() {
  return (
    <Layout>
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight text-primary">
          Please enter the OTP sent to your mobile number
        </h2>
        <p className="pb-10 text-muted-foreground">
          Request a new OTP if you did not receive it.
        </p>
      </div>
      <OtpForm />
    </Layout>
  )
}
