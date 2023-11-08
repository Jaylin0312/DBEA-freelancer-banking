export const GetAllAccounts = async (
  userID: string,
  pin: string,
  otp: string
) => {
  const base_url = process.env.NEXT_PUBLIC_SERVICE_BASE_URL
  const response = await fetch(`${base_url}/account/get-all-accounts`, {
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
  return res.data
}

export const GetMonthlyCashflow = async (
  userID: string,
  pin: string,
  otp: string,
  accountID: string
) => {
  const base_url = process.env.NEXT_PUBLIC_SERVICE_BASE_URL
  const response = await fetch(`${base_url}/account/monthly-cashflow`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ data: { userID, pin, otp, accountID } }),
  })
  if (!response.ok) {
    throw new Error("Failed to log in")
  }
  const res = await response.json()
  return res
}
