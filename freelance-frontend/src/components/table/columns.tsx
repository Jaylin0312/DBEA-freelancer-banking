import { useRouter } from "next/router"
import { ColumnDef } from "@tanstack/react-table"
import { ChevronDownIcon, ChevronUpIcon, UserCog } from "lucide-react"

export const Columns: ColumnDef<LoanTableApplication>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <div>ID</div>
          {column.getIsSorted() === "asc" ? (
            <ChevronUpIcon className="h-5 w-5" />
          ) : (
            <ChevronDownIcon className="h-5 w-5" />
          )}
        </button>
      )
    },
  },
  {
    accessorKey: "userID",
    header: "UserID",
  },
  {
    accessorKey: "settlementAccount",
    header: "Settlement Account",
  },
  {
    accessorKey: "productName",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <div>Loan Type</div>
          {column.getIsSorted() === "asc" ? (
            <ChevronUpIcon className="h-5 w-5" />
          ) : (
            <ChevronDownIcon className="h-5 w-5" />
          )}
        </button>
      )
    },
  },
  {
    accessorKey: "loanAmount",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <div>Loan Amount</div>
          {column.getIsSorted() === "asc" ? (
            <ChevronUpIcon className="h-5 w-5" />
          ) : (
            <ChevronDownIcon className="h-5 w-5" />
          )}
        </button>
      )
    },
  },
  {
    accessorKey: "assetValue",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <div>Asset Value</div>
          {column.getIsSorted() === "asc" ? (
            <ChevronUpIcon className="h-5 w-5" />
          ) : (
            <ChevronDownIcon className="h-5 w-5" />
          )}
        </button>
      )
    },
  },
  {
    accessorKey: "numberOfMonths",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <div>Number of Months</div>
          {column.getIsSorted() === "asc" ? (
            <ChevronUpIcon className="h-5 w-5" />
          ) : (
            <ChevronDownIcon className="h-5 w-5" />
          )}
        </button>
      )
    },
  },
  {
    accessorKey: "approvalStatus",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <div>Status</div>
          {column.getIsSorted() === "asc" ? (
            <ChevronUpIcon className="h-5 w-5" />
          ) : (
            <ChevronDownIcon className="h-5 w-5" />
          )}
        </button>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <div>Date</div>
          {column.getIsSorted() === "asc" ? (
            <ChevronUpIcon className="h-5 w-5" />
          ) : (
            <ChevronDownIcon className="h-5 w-5" />
          )}
        </button>
      )
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const application = row.original
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const router = useRouter()
      return (
        <div>
          <UserCog
            onClick={() =>
              router.push({
                pathname: `/loan/${application.id}/application-details`,
                query: { ...application },
              })
            }
            className="mr-2 h-5 w-5 cursor-pointer text-blue-500 hover:scale-105"
          />
        </div>
      )
    },
  },
]
