import { useEffect, useState } from "react"
import { GetMonthlyCashflow } from "@/call/accountAPI"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

export function Cashflow({ accountID }: { accountID: string }) {
  const [cashflow, setCashflow] = useState<Cashflow[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchCashflow() {
      setIsLoading(true)
      const userID = localStorage.getItem("userID")
      const pin = localStorage.getItem("pin")
      const otp = localStorage.getItem("otp")
      if (userID && pin && otp) {
        try {
          const response = await GetMonthlyCashflow(userID, pin, otp, accountID)
          if (response && response.data.cashflow.length > 0) {
            const cashflows = response.data.cashflow.map((cf: Cashflow) => cf)
            setCashflow(cashflows)
          } else {
            setCashflow([])
          }
        } catch (error) {
          console.error("Failed to fetch cashflow:", error)
          setCashflow([])
        }
      }
      setIsLoading(false)
    }
    fetchCashflow()
  }, [accountID])

  if (isLoading) {
    return <div>Loading cashflow data...</div>
  }

  if (cashflow.length === 0) {
    return <div>No past cashflow found.</div>
  }
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart width={800} height={400} data={cashflow}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="outgoing" fill="#EFA3C8" />
        <Bar dataKey="incoming" fill="#6E9BFD" />
      </BarChart>
    </ResponsiveContainer>
  )
}
