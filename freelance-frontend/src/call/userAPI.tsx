export const UserDetails = async (userID: string, pin: string, otp: string) => {
  const base_url = process.env.NEXT_PUBLIC_SERVICE_BASE_URL
  console.log("userDetails", userID, pin, otp)
  const response = await fetch(`${base_url}/user/details`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ data: { userID, pin, otp } }),
  })
  if (!response.ok) {
    throw new Error("Failed to log in")
  }
  const res = await response.json()
  return res
}

export const GetApplicantDetails = async (applicantID: string) => {
  const base_url = process.env.NEXT_PUBLIC_SERVICE_BASE_URL
  const response = await fetch(
    `${base_url}/admin/user-details/${applicantID}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    }
  )
  if (!response.ok) {
    throw new Error("Failed to log in")
  }
  const res = await response.json()
  console.log("res", res)
  return res
}
