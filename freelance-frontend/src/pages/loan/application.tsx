import { Separator } from "@/components/ui/separator"
import { Layout } from "@/components/layout"
import { LoanForm } from "@/components/loanForm"

export default function LoanApplication() {
  return (
    <Layout>
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight text-primary">
          Loan Application
        </h2>
        <p className="text-muted-foreground">
          Please fill out the form below to apply for a loan.
        </p>
      </div>
      <Separator className="my-6" />
      <LoanForm />
    </Layout>
  )
}
