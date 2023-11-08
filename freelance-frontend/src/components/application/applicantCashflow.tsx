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

export function ApplicantCashflow({
  userID,
  accountID,
}: {
  userID: string
  accountID: string
}) {
  const [cashflow, setCashflow] = useState<Cashflow[]>([])
  const [isEmpty, setIsEmpty] = useState(false)

  useEffect(() => {
    async function fetchCashflow() {
      const response = await GetMonthlyCashflow(userID, "011698", "016825", accountID)
      if (response && response.data.cashflow.length > 0) {
        const cashflows = response.data.cashflow.map((cashflow: Cashflow) => ({
          ...cashflow,
        }))
        setCashflow(cashflows)
      } else {
        setIsEmpty(true)
      }
    }
    fetchCashflow()
  }, [accountID, userID])

  if (isEmpty) {
    return <p>No past cashflow found.</p>
  }

  return (
    <div className="pt-16">
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
    </div>
  )
}
