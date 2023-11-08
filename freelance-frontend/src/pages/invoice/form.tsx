import { InvoiceForm } from "@/components/invoiceForm"
import { Layout } from "@/components/layout"

export default function LoanApplication() {
  return (
    <Layout>
      <div className="space-y-0.5">
        <div className="text-2xl font-bold tracking-tight text-primary">
          Invoice Generator
        </div>
        <div className="text-muted-foreground">
          Please fill out the form below to generate an invoice.
        </div>
      </div>
      <InvoiceForm />
    </Layout>
  )
}
