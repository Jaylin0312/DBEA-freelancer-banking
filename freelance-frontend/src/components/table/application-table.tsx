import React from "react"
import { GetAllLoanApplications } from "@/call/loanAPI"
import { QueryClient, QueryClientProvider, useQuery } from "react-query"

import { Columns } from "./columns"
import { DataTable } from "./data-table"

const ApplicationTable = () => {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <ApplicationData />
    </QueryClientProvider>
  )
}

const ApplicationData = () => {
  const { isLoading, data } = useQuery("data", async () => {
    const response = await GetAllLoanApplications()
    const userData = response.data.loans
    return userData
  })

  if (isLoading) {
    return <div>User Table Loading...</div>
  }

  return (
    <div>
      <DataTable columns={Columns} data={data} />
    </div>
  )
}

export default ApplicationTable
