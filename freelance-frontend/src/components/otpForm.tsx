import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

const OtpForm: React.FC = () => {
  const [otp, setOtp] = useState<number[]>([0, 0, 0, 0, 0, 0])
  const { push } = useRouter()
  const { toast } = useToast()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    let value = e.target.value

    if (/[^0-9]/.test(value)) {
      return
    }

    otp[index] = parseInt(value, 10) // Convert to integer

    if (index < otp.length - 1 && value !== "") {
      document.getElementById(`otp-${index + 1}`)?.focus()
    }

    setOtp([...otp])
  }

  const handleSubmit = () => {
    console.log("Sending OTP to backend:", otp)
    localStorage.setItem("otp", "999999")
    toast({
      title: "Loan application update",
      description: "Loan application is submitted successfully",
      duration: 2000,
    })
    setTimeout(() => {
      push("/loan/application-list")
    }, 2000)
  }

  const boxes = Array.from({ length: 6 }, (_, index) => (
    <div key={index} className="mx-2 inline-block h-16 w-16">
      <Input
        className="flex h-full w-full flex-col items-center justify-start rounded-xl border border-gray-200 bg-white px-5 text-center text-lg outline-none ring-blue-700 focus:bg-gray-50 focus:ring-1"
        name={`otp-${index}`}
        id={`otp-${index}`}
        maxLength={1}
        onChange={(e) => handleChange(e, index)}
      />
    </div>
  ))

  return (
    <div className="flex flex-col gap-10">
      <div>{boxes}</div>
      <Button className="max-w-[10rem]" onClick={handleSubmit}>
        Submit
      </Button>
    </div>
  )
}

export default OtpForm
