import { useEffect, useState } from "react"
import { GetAllLoans } from "@/call/loanAPI"

import { LoanStatus } from "@/types/enums"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Layout } from "@/components/layout"
import LoanApplicationCard from "@/components/loanApplicationCard"

export default function ApplicationList() {
  const [applications, setApplications] = useState<LoanApplication[]>([])
  const additionalData: LoanApplication[] = [
    {
      id: "8249sbf-1hdb-4h3d-9h3d-3h4d3h4d3h4d",
      userID: "USER",
      productName: "Renovation Loan",
      loanPurpose: "New Renovative Loan for my new house at Jurong",
      loanAmount: "100000",
      numberOfMonths: "120",
      assetValue: "1000000",
      title: "New Renovative Loan",
      currency: "SGD",
      settlementAccount: "1234567890",
      approvalStatus: LoanStatus.Approved,
      email: "email",
      loanTerms: {
        Interest: "3.5",
        MaturityDate: "2021-10-01T00:00:00.000Z",
        InterestRate: "3.5",
        MonthlyInstallment: "1000",
        AdditionalInterest: "3.5",
        MonthlyInstallmentAdditional: "1000",
        TotalLoanAmount: "100000",
      },
      createdAt: "2023-10-11 07:12:36",
    },
    {
      id: "b249sbf-2kdb-5h3d-9h4d-3h5d3h5d3h5d",
      userID: "USER2",
      productName: "Personal Loan",
      loanPurpose: "Personal Loan for wedding expenses",
      loanAmount: "20000",
      numberOfMonths: "60",
      assetValue: "50000",
      title: "Wedding Expenses Loan",
      currency: "SGD",
      settlementAccount: "0987654321",
      approvalStatus: LoanStatus.Pending,
      email: "user2@example.com",
      loanTerms: {
        Interest: "5.0",
        MaturityDate: "2023-05-01T00:00:00.000Z",
        InterestRate: "5.0",
        MonthlyInstallment: "400",
        AdditionalInterest: "5.0",
        MonthlyInstallmentAdditional: "400",
        TotalLoanAmount: "24000",
      },
      createdAt: "2023-08-02 13:45:27",
    },
    {
      id: "c349sbf-3ldb-6h3d-9h5d-3h6d3h6d3h6d",
      userID: "USER3",
      productName: "Education Loan",
      loanPurpose: "Education Loan for university tuition fees",
      loanAmount: "30000",
      numberOfMonths: "120",
      assetValue: "200000",
      title: "University Tuition Loan",
      currency: "SGD",
      settlementAccount: "1231231234",
      approvalStatus: LoanStatus.Rejected,
      email: "user3@example.com",
      loanTerms: {
        Interest: "4.0",
        MaturityDate: "2028-08-01T00:00:00.000Z",
        InterestRate: "4.0",
        MonthlyInstallment: "300",
        AdditionalInterest: "4.0",
        MonthlyInstallmentAdditional: "300",
        TotalLoanAmount: "36000",
      },
      createdAt: "2023-1-02 18:33:12",
    },
  ]

  useEffect(() => {
    async function fetchLoans() {
      try {
        const res = await GetAllLoans()
        setApplications([...res.data.loans, ...additionalData])
      } catch (error) {
        console.error("Failed to fetch loans:", error)
      }
    }
    fetchLoans()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Layout>
      <div className="flex justify-between">
        <div className="pb-10 text-3xl font-bold text-primary">
          Application List
        </div>
      </div>
      {applications.length === 0 ? (
        <div className="text-xl font-bold">No applications found.</div>
      ) : (
        <Tabs defaultValue="Home Loan">
          <TabsList>
            <TabsTrigger value="Home Loan">Home</TabsTrigger>
            <TabsTrigger value="Personal Loan">Personal</TabsTrigger>
            <TabsTrigger value="Renovation Loan">Renovation</TabsTrigger>
            <TabsTrigger value="Education Loan">Education</TabsTrigger>
          </TabsList>
          <div className="flex flex-col gap-10 pt-10">
            {applications.map((application, index) => (
              <TabsContent key={index} value={application.productName}>
                <LoanApplicationCard key={index} application={application} />
              </TabsContent>
            ))}
          </div>
        </Tabs>
      )}
    </Layout>
  )
}
