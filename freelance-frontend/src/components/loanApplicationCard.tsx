import cn from "classnames"

import { LoanStatus, LoanType } from "@/types/enums"

import { Badge } from "./ui/badge"

interface LoanApplicationCardProps {
  application: LoanApplication
}

function getGradient(type: string): string {
  switch (type) {
    case LoanType.Education:
      return "bg-gradient-to-r from-green-400 to-blue-500"
    case LoanType.Home:
      return "bg-gradient-to-r from-blue-400 to-purple-500"
    case LoanType.Personal:
      return "bg-gradient-to-r from-yellow-400 to-red-500"
    case LoanType.Renovation:
      return "bg-gradient-to-r from-teal-400 to-cyan-500"
    default:
      return ""
  }
}

const LoanApplicationCard: React.FC<LoanApplicationCardProps> = ({
  application,
}) => {
  return (
    <div className="flex space-x-4 rounded-lg border border-slate-200 shadow-sm">
      <div
        className={`flex min-w-[150px] basis-1/5 items-center justify-center rounded-l-lg p-4 ${getGradient(
          application.productName
        )}`}
      >
        <p className="text-xl font-semibold text-white">{application.id}</p>
      </div>
      <div className="flex basis-4/5 p-6">
        {/* Main content */}
        <div className="flex-grow">
          <div className="flex flex-wrap items-center justify-between pb-2">
            <div className="text-xl font-semibold text-slate-700">
              {application.title}
            </div>
            <Badge
              className={cn(
                application.approvalStatus === LoanStatus.Pending
                  ? "bg-yellow-400 text-black"
                  : application.approvalStatus === LoanStatus.Approved
                  ? "bg-green-400 text-white"
                  : application.approvalStatus === LoanStatus.Rejected
                  ? "bg-red-400 text-white"
                  : "bg-gray-400 text-white"
              )}
            >
              <span>{application.approvalStatus}</span>
            </Badge>
          </div>

          {/* Description */}
          <p className="text-md pb-4 text-gray-500">
            {application.loanPurpose}
          </p>

          <div className="flex flex-wrap">
            <div className="pr-4 text-sm text-gray-500">
              <span className="">Submission: </span>
              {application.createdAt}{" "}
            </div>
            <div className="text-sm text-gray-500">
              Number of Installments: {application.numberOfMonths}{" "}
            </div>
          </div>

          <div className="mt-2 text-sm text-gray-500">
            Loan Amount: ${application.loanAmount}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoanApplicationCard
