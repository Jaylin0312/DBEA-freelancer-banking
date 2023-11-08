import * as React from "react"
import { useRouter } from "next/router"
import { AdminLogin, UserLogin } from "@/call/authAPI"
import { UserDetails } from "@/call/userAPI"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function AuthCard() {
  const [userID, setUsername] = React.useState("")
  const [pin, setPin] = React.useState("")
  const [otp, setOtp] = React.useState("")
  const [isOtpSent, setIsOtpSent] = React.useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isOtpSent == false) {
      localStorage.setItem("userID", userID)
      localStorage.setItem("pin", pin)
      if (userID.includes("ADMIN")) {
        const res = await AdminLogin(userID, pin)
        if (res.status == "error") {
          throw new Error(res.message)
        }
        const role = res.data.additionalUserInfo.role
        localStorage.setItem("role", role)
        router.push("/admin/dashboard")
        return
      }
      setIsOtpSent(true)
      const res = await UserLogin(userID, pin)
      if (res.status == "error") {
        throw new Error(res.message)
      }
    } else {
      localStorage.setItem("otp", "999999")
      const res = await UserDetails(userID, pin, otp)
      if (res.status == "error") {
        throw new Error(res.message)
      } else {
        const role = res.data.additionalUserInfo.role
        localStorage.setItem("role", role)
        router.push("/user/dashboard")
        setIsOtpSent(false)
      }
    }
  }

  return (
    <Card className="w-[350px] px-2">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription className="pt-2">
          Welcome! Please login using your username and PIN number
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Your registered username"
                autoCorrect="off"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="pin">PIN</Label>
              <Input
                type="password"
                id="pin"
                placeholder="Your PIN number"
                onChange={(e) => setPin(e.target.value)}
              />
            </div>
            {isOtpSent && (
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="otp">OTP</Label>
                <Input
                  id="otp"
                  placeholder="OTP number sent to your phone"
                  autoCorrect="off"
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex gap-4">
        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={userID.length == 0 || pin.length == 0}
        >
          Login
        </Button>
      </CardFooter>
      <CardFooter>
        <div className="relative w-full">
          <div className="relative flex gap-1 text-xs">
            Do not have an account? Register{" "}
            <span className="font-medium text-blue-600 hover:underline dark:text-blue-500">
              here
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
