import { useRouter } from "next/router"
import { UpdateLoanApplication } from "@/call/loanAPI"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { ApplicantCashflow } from "@/components/application/applicantCashflow"
import { ApplicantDetails } from "@/components/application/applicantDetails"
import { LoanDetails } from "@/components/application/loanDetails"
import { Layout } from "@/components/layout"

export default function ApplicationDetails() {
  const router = useRouter()
  const { toast } = useToast()
  async function handleStatus(action: string) {
    if (action === "APPROVED") {
      const res = await UpdateLoanApplication(
        router.query.id as string,
        action,
        "Approving the loan application"
      )
      if (res.status === "success") {
        toast({
          title: "Loan application update",
          description: "The loan application has been approved",
          duration: 2000,
        })
        setTimeout(() => {
          router.push(`/admin/dashboard`)
        }, 2000)
      } else {
        alert("Failed to approve loan application")
      }
    } else {
      const res = await UpdateLoanApplication(
        router.query.id as string,
        action,
        "Declining the loan application"
      )
      if (res.status === "success") {
        toast({
          title: "Loan application update",
          description: "The loan application has been declined",
          duration: 2000,
        })
        setTimeout(() => {
          router.push(`/admin/dashboard`)
        }, 2000)
      } else {
        alert("Failed to decline loan application")
      }
    }
  }
  return (
    <Layout>
      <div className="flex flex-wrap items-end justify-between">
        <div className="space-y-0.5">
          <div className="text-2xl font-bold tracking-tight text-primary">
            Application Record
          </div>
          <div className="text-muted-foreground">
            Please find the details of loan application {router.query.id} below
          </div>
        </div>
        <div>
          {router.query.approvalStatus === "PENDING" ? (
            <div className="flex gap-5">
              <Button
                onClick={() => {
                  handleStatus("APPROVED")
                }}
              >
                Approve
              </Button>
              <Button
                onClick={() => {
                  handleStatus("REJECTED")
                }}
                variant={"destructive"}
              >
                Decline
              </Button>
            </div>
          ) : (
            <div className="flex gap-5">
              <Button disabled>Approve</Button>
              <Button disabled variant={"destructive"}>
                Decline
              </Button>
            </div>
          )}
        </div>
      </div>
      <Separator className="my-6" />
      <div className="pb-4">
        <Tabs defaultValue="Applicant Details">
          <TabsList>
            <TabsTrigger value="Applicant Details">
              Applicant Details
            </TabsTrigger>
            <TabsTrigger value="Applicant Cashflow">
              Applicant Cashflow
            </TabsTrigger>
            <TabsTrigger value="Loan Details">Loan Details</TabsTrigger>
          </TabsList>
          <TabsContent value="Applicant Details">
            <ApplicantDetails application={router.query} />
          </TabsContent>
          <TabsContent value="Loan Details">
            <LoanDetails application={router.query} />
          </TabsContent>
          <TabsContent value="Applicant Cashflow">
            <ApplicantCashflow
              userID={router.query.userID as string}
              accountID={router.query.settlementAccount as string}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
}
