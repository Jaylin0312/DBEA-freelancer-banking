declare type SideBarItem = {
  title: string
  href: string
  icon: React.ReactElement
}

declare type LoanFormApplication = {
  userID: string
  pin: string
  otp: string
  productID: string
  loanPurpose: string
  loanAmount: string
  numberOfMonths: string
  assetValue: string
  title: string
  currency: string
  settlementAccount: string
  email: string
  mobileNumber: string
}

declare type LoanTerms = {
  Interest: string
  MaturityDate: string
  InterestRate: string
  MonthlyInstallment: string
  AdditionalInterest: string
  MonthlyInstallmentAdditional: string
  TotalLoanAmount: string
}

declare type LoanApplication = {
  id: string
  userID: string
  productName: string
  loanPurpose: string
  loanAmount: string
  numberOfMonths: string
  assetValue: string
  title: string
  currency: string
  settlementAccount: string
  approvalStatus: string
  email: string
  loanTerms: LoanTerms
  createdAt: string
}

declare type LoanTableApplication = {
  id: string
  userID: string
  productName: string
  loanAmount: string
  assetValue: string
  settlementAccount: string
  numberOfMonths: string
  approvalStatus: string
  createdAt: string
}

declare type Account = {
  interestRate: string
  accountID: string
  parentAccountFlag: boolean
  balance: string
  productID: string
  currentStatus: string
  currency: string
  homeBranch: string
  accountOpenDate: string
  maintenancehistory: {
    lastTransactionBranch: string
    lastMaintenanceOfficer: string
  }
  officerID: string
}

declare type Cashflow = {
  date: string
  incoming: number
  outgoing: number
}
