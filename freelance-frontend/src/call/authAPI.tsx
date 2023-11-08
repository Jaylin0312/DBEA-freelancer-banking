export const UserLogin = async (userID: string, pin: string) => {
  const base_url = process.env.NEXT_PUBLIC_SERVICE_BASE_URL
  const response = await fetch(`${base_url}/user/otp`, {
    method: "POST",
    body: JSON.stringify({ data: { userID, pin } }),
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  })
  if (!response.ok) {
    throw new Error("Failed to log in")
  }
  const res = await response.json()
  return res
}

export const AdminLogin = async (userID: string, pin: string) => {
  const base_url = process.env.NEXT_PUBLIC_SERVICE_BASE_URL
  const otp = "785003"
  const response = await fetch(`${base_url}/user/details`, {
    method: "POST",
    body: JSON.stringify({ data: { userID, pin, otp } }),
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  })
  if (!response.ok) {
    throw new Error("Failed to log in")
  }
  const res = await response.json()
  return res
}
