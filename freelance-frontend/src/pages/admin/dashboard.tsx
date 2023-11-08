import { Layout } from "@/components/layout"
import ApplicationTable from "@/components/table/application-table"

export default function Dashboard() {
  return (
    <Layout>
      <div className="flex justify-between">
        <div className="pb-10 text-3xl font-bold text-primary">
          Application List
        </div>
      </div>
      <div className="flex flex-wrap gap-5 pb-10 lg:flex-nowrap">
        <ApplicationTable />
      </div>
    </Layout>
  )
}
