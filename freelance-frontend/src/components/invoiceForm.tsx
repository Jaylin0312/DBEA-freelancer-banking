import { Blob } from "buffer"
import { useEffect, useState } from "react"
import { GetAllAccounts } from "@/call/accountAPI"
import { sendEmail, storeInvoice } from "@/call/firebaseAPI"
import { zodResolver } from "@hookform/resolvers/zod"
import { pdf, PDFDownloadLink } from "@react-pdf/renderer"
import cn from "classnames"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { invoiceSchema } from "@/types/zschema"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

import InvoiceDocument from "./invoiceDocument"

type InvoiceValues = z.infer<typeof invoiceSchema>

export function InvoiceForm() {
  const form = useForm<InvoiceValues>({
    resolver: zodResolver(invoiceSchema),
    mode: "onChange",
  })

  const [currentSection, setCurrentSection] = useState(1)
  const [progress, setProgress] = useState(33)
  const [accountIds, setAccountIds] = useState<string[]>([])
  const { toast } = useToast()

  const handleNextSection = () => {
    setCurrentSection((prevSection) => prevSection + 1)
    setProgress((prevProgress) => prevProgress + 33)
  }

  const handleInvoiceSubmission = async (): Promise<void> => {
    const formData: InvoiceValues = form.getValues()
    try {
      const pdfBlob: Blob = await generatePdfDocument(formData)
      const res = await storeInvoice(pdfBlob, formData.billingEmail)
      if (res.status === "success") {
        toast({
          title: "Invoice Generation Update",
          description: "Invoice generated successfully",
          duration: 5000,
        })
        console.log("Invoice stored successfully")
      } else {
        console.error("Error storing invoice")
      }
    } catch (error) {
      console.error("Error in PDF generation or sending URL:", error)
    }
  }

  async function generatePdfDocument(data: InvoiceValues): Promise<any> {
    const blob = await pdf(<InvoiceDocument {...data} />).toBlob()
    return blob
  }

  function onSubmit(data: InvoiceValues) {
    console.log(data)
  }

  useEffect(() => {
    async function fetchAccounts() {
      const userID = localStorage.getItem("userID")
      const pin = localStorage.getItem("pin")
      const otp = localStorage.getItem("otp")
      if (userID && pin && otp) {
        try {
          console.log(userID, pin, otp)
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
      <Progress className="mt-8" value={progress} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {currentSection === 1 && (
            <div className="space-y-8">
              <div className="pt-8 text-lg font-bold tracking-tight text-primary">
                Billing Company Details
              </div>
              <FormField
                name="billingCompany"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Billing Company</FormLabel>
                    <FormControl>
                      <Input
                        defaultValue={""}
                        placeholder="Mediacorp"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="billingEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Billing Email</FormLabel>
                    <FormControl>
                      <Input
                        defaultValue={""}
                        placeholder="mediacorp@gmail.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="billingAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Billing Address</FormLabel>
                    <FormControl>
                      <Input
                        defaultValue={""}
                        placeholder="1 Media Circle"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
          {currentSection === 2 && (
            <div className="space-y-8">
              <div className="pt-8 text-lg font-bold tracking-tight text-primary">
                My Company Details
              </div>
              <FormField
                name="clientCompany"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>My Company</FormLabel>
                    <FormControl>
                      <Input defaultValue={""} placeholder="DBEA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="clientEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>My Email</FormLabel>
                    <FormControl>
                      <Input
                        defaultValue={""}
                        placeholder="alan@gmail.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="clientAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>My Address</FormLabel>
                    <FormControl>
                      <Input
                        defaultValue={""}
                        placeholder="2 Jurong East Street 21"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="clientContact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>My Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        defaultValue={""}
                        placeholder="+65 1739 7277"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
          {currentSection === 3 && (
            <div className="space-y-8">
              <div className="pt-8 text-lg font-bold tracking-tight text-primary">
                Others
              </div>
              <FormField
                control={form.control}
                name="bankAccount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank Account</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an account to ask client to bill to" />
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
              <FormField
                name="itemDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Description</FormLabel>
                    <FormControl>
                      <Input
                        defaultValue={""}
                        placeholder="Website Design"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="itemQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Quantity</FormLabel>
                    <FormControl>
                      <Input defaultValue={""} placeholder="$1000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="itemPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Price</FormLabel>
                    <FormControl>
                      <Input defaultValue={""} placeholder="$1000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormItem>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(new Date(field.value), "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={new Date(field.value)}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="additionalNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Terms and Conditions</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="terms" />
                        <label
                          htmlFor="terms"
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          I acknowledge that this invoice service will be
                          chargeable at $10 / Month
                        </label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </form>
        <div className="pt-8">
          {currentSection < 3 ? (
            <Button className="min-w-[100px]" onClick={handleNextSection}>
              Next
            </Button>
          ) : (
            <Button
              className="min-w-[100px]"
              onClick={() => {
                console.log("Invoice submitted")
              }}
            >
              <PDFDownloadLink
                document={<InvoiceDocument {...form.getValues()} />}
                fileName="invoice.pdf"
                onClick={handleInvoiceSubmission}
              >
                {({ blob, url, loading, error }) =>
                  loading ? "Loading document..." : "Generate Invoice"
                }
              </PDFDownloadLink>
            </Button>
          )}
        </div>
      </Form>
    </div>
  )
}
