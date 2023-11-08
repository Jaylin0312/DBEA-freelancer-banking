export const ApplyLoan = async (loanData: LoanFormApplication) => {
  const base_url = process.env.NEXT_PUBLIC_SERVICE_BASE_URL
  const response = await fetch(`${base_url}/loan/apply`, {
    method: "POST",
    body: JSON.stringify({
      data: {
        userID: loanData.userID,
        pin: loanData.pin,
        otp: loanData.otp,
        mobileNumber: loanData.mobileNumber,
        currency: loanData.currency,
        productID: "201",
        loanAmount: loanData.loanAmount,
        loanPurpose: loanData.loanPurpose,
        numberOfMonths: loanData.numberOfMonths,
        assetValue: loanData.assetValue,
        title: loanData.title,
        settlementAccount: loanData.settlementAccount,
        email: loanData.email,
      },
    }),
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

export const CalculateLoanInstallment = async (
  loanData: LoanFormApplication
) => {
  const base_url = process.env.NEXT_PUBLIC_SERVICE_BASE_URL
  const response = await fetch(`${base_url}/loan/calculate-loan-installment`, {
    method: "POST",
    body: JSON.stringify({
      data: {
        userID: loanData.userID,
        pin: loanData.pin,
        otp: loanData.otp,
        mobileNumber: loanData.mobileNumber,
        currency: loanData.currency,
        productID: "201",
        loanAmount: loanData.loanAmount,
        loanPurpose: loanData.loanPurpose,
        numberOfMonths: loanData.numberOfMonths,
        assetValue: loanData.assetValue,
        title: loanData.title,
        settlementAccount: loanData.settlementAccount,
        email: loanData.email,
      },
    }),
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

export const GetAllLoans = async () => {
  const base_url = process.env.NEXT_PUBLIC_SERVICE_BASE_URL
  const userID = localStorage.getItem("userID")
  const response = await fetch(`${base_url}/loan/${userID}`, {
    method: "GET",
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

export const GetAllLoanApplications = async () => {
  const base_url = process.env.NEXT_PUBLIC_SERVICE_BASE_URL
  const response = await fetch(`${base_url}/loan/get-all`, {
    method: "GET",
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

export const UpdateLoanApplication = async (
  loanID: string,
  status: string,
  additional: string
) => {
  const base_url = process.env.NEXT_PUBLIC_SERVICE_BASE_URL
  const response = await fetch(`${base_url}/loan/approval`, {
    method: "PATCH",
    body: JSON.stringify({
      data: {
        id: loanID,
        approvalStatus: status,
        additionalComments: additional,
      },
    }),
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
