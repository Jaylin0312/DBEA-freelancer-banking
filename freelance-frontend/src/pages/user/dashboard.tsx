import { useEffect, useState } from "react"
import { GetAllAccounts, GetMonthlyCashflow } from "@/call/accountAPI"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Cashflow } from "@/components/charts/cashflow"
import { CurrentBalance } from "@/components/charts/currentBalance"
import { SavingsTarget } from "@/components/charts/savingsTarget"
import { SpendingCategory } from "@/components/charts/spendingCategory"
import { Layout } from "@/components/layout"

export default function Dashboard() {
  const [accountIds, setAccountIds] = useState<string[]>([])
  const [selectedAccountId, setSelectedAccountId] = useState<string>("")

  const handleSelectChange = (value: string) => {
    setSelectedAccountId(value)
  }

  useEffect(() => {
    async function fetchAccounts() {
      const userID = localStorage.getItem("userID")
      const pin = localStorage.getItem("pin")
      const otp = localStorage.getItem("otp")
      if (userID && pin && otp) {
        try {
          const response = await GetAllAccounts(userID, pin, otp)
          if (response) {
            const ids = response.account.map(
              (account: Account) => account.accountID
            )
            setAccountIds(ids)
          }
        } catch (error) {
          console.error("Failed to fetch accounts:", error)
        }
      }
    }
    fetchAccounts()
  }, [])

  return (
    <Layout>
      <div className="flex flex-wrap gap-5 pb-10 lg:flex-nowrap">
        <CurrentBalance />
        <SpendingCategory />
        <SavingsTarget />
      </div>
      <div className="flex justify-between">
        <div className="pb-10 text-2xl font-bold text-primary">
          Monthly Cashflow
        </div>
        <div>
          <Select
            onValueChange={handleSelectChange}
            defaultValue={accountIds[0]}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select account to check for cashflow" />
            </SelectTrigger>
            <SelectContent>
              {accountIds.map((accountId) => (
                <SelectItem key={accountId} value={accountId}>
                  {accountId}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Cashflow key={selectedAccountId} accountID={selectedAccountId} />
    </Layout>
  )
}
