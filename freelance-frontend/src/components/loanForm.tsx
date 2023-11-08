import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { GetAllAccounts } from "@/call/accountAPI"
import { UserLogin } from "@/call/authAPI"
import { ApplyLoan, CalculateLoanInstallment } from "@/call/loanAPI"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { loanApplicationSchema } from "@/types/zschema"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { InterestDialog } from "@/components/interestDialog"

type LoanApplicationValues = z.infer<typeof loanApplicationSchema>

export function LoanForm() {
  const [accountIds, setAccountIds] = useState<string[]>([])
  const [dialogState, setDialogState] = useState({
    show: false,
    data: null,
  })
  const form = useForm<LoanApplicationValues>({
    resolver: zodResolver(loanApplicationSchema),
    mode: "onChange",
  })
  const loanOptions = [
    { value: "Personal", label: "Personal" },
    { value: "Home", label: "Home" },
    { value: "Renovation", label: "Renovation" },
    { value: "Education", label: "Education" },
  ]
  const { push } = useRouter()

  async function onSubmit(data: LoanApplicationValues) {
    const pin = localStorage.getItem("pin")
    const otp = localStorage.getItem("otp")
    if (pin && otp) {
      const currency = "SGD"
      const loanData: LoanFormApplication = { ...data, pin, otp, currency }
      const response = await ApplyLoan(loanData)
      if (response.status === "success") {
        push("/loan/otp")
        UserLogin(data.userID, pin)
      }
    } else {
      throw new Error("Failed to submit application")
    }
  }

  async function CalculateLoan(data: LoanApplicationValues) {
    const pin = localStorage.getItem("pin")
    const otp = localStorage.getItem("otp")
    if (dialogState.show) {
      setDialogState({
        show: false,
        data: null,
      })
    } else {
      if (pin && otp) {
        const currency = "SGD"
        const loanData: LoanFormApplication = { ...data, pin, otp, currency }
        const response = await CalculateLoanInstallment(loanData)
        if (response.status === "success") {
          setDialogState({
            show: true,
            data: response.data,
          })
        }
      } else {
        throw new Error("Failed to calculate interest")
      }
    }
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
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            name="userID"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User ID</FormLabel>
                <FormControl>
                  <Input defaultValue={""} placeholder="John Wong" {...field} />
                </FormControl>
                <FormDescription>
                  Please enter your registered User ID
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mobileNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input
                    defaultValue={""}
                    placeholder="+65 1739 7277"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Please enter your registered phone number with country code
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    defaultValue={""}
                    placeholder="john.wong@gmail.com"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Please use the email address registered with your bank account
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loan Title</FormLabel>
                <FormControl>
                  <Input
                    defaultValue={""}
                    placeholder="My Home Loan"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="loanPurpose"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loan Purpose</FormLabel>
                <FormControl>
                  <Textarea
                    defaultValue={""}
                    placeholder="Describe briefly the purpose of the loan"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="productID"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loan Type</FormLabel>
                <FormControl>
                  <RadioGroup
                    className="flex gap-10"
                    defaultValue={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                  >
                    {loanOptions.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={`r${index}`} />
                        <Label htmlFor={`r${index}`}>{option.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="loanAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loan Amount</FormLabel>
                <FormControl>
                  <Input defaultValue={""} placeholder="$1000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="assetValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Asset Value</FormLabel>
                <FormControl>
                  <Input defaultValue={""} placeholder="$1000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="numberOfMonths"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Months of Installments</FormLabel>
                <FormControl>
                  <Input defaultValue={""} placeholder="200" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="settlementAccount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Settlement Account Number</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an account to apply for loan" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {accountIds.map((accountId) => (
                      <SelectItem key={accountId} value={accountId}>
                        {accountId}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="pt-10">
            <div className="flex gap-6">
              <Button
                className="min-w-[100px]"
                type="button"
                onClick={() => form.handleSubmit(CalculateLoan)()}
              >
                {dialogState.show && (
                  <InterestDialog
                    isOpen={dialogState.show}
                    onClose={() => setDialogState({ show: false, data: null })}
                    data={dialogState.data}
                  />
                )}
                Calculate Interest
              </Button>
              <Button
                className="min-w-[100px]"
                onSubmit={form.handleSubmit(onSubmit)}
                type="submit"
              >
                Submit Application
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
