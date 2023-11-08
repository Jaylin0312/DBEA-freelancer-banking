import { ParsedUrlQuery } from "querystring"

export function LoanDetails({ application }: { application: ParsedUrlQuery }) {
  console.log(application)
  return (
    <div className="flex flex-col gap-4 pt-2">
      <div className="px-4 sm:px-0">
        <div className="pt-2 text-base font-semibold leading-7 text-gray-900">
          Loan Details
        </div>
        <div className="max-w-2xl pt-1 text-sm leading-6 text-gray-500">
          Details for this loan application.
        </div>
      </div>
      <div className="border-t border-gray-100">
        <div className="divide-y divide-gray-100">
          {application && (
            <>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <div className="text-sm font-medium leading-6 text-gray-900">
                  Type
                </div>
                <div className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {application.productName}
                </div>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <div className="text-sm font-medium leading-6 text-gray-900">
                  Title
                </div>
                <div className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {application.title}
                </div>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <div className="text-sm font-medium leading-6 text-gray-900">
                  Purpose
                </div>
                <div className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {application.loanPurpose}
                </div>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <div className="text-sm font-medium leading-6 text-gray-900">
                  Loan Amount
                </div>
                <div className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {application.loanAmount}
                </div>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <div className="text-sm font-medium leading-6 text-gray-900">
                  Asset Value
                </div>
                <div className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {application.assetValue}
                </div>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <div className="text-sm font-medium leading-6 text-gray-900">
                  Number of Months for Repayment
                </div>
                <div className="mt-1 flex flex-col text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {application.numberOfMonths}
                </div>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <div className="text-sm font-medium leading-6 text-gray-900">
                  Currency
                </div>
                <div className="mt-1 flex flex-col text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {application.currency}
                </div>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <div className="text-sm font-medium leading-6 text-gray-900">
                  Settlement Account
                </div>
                <div className="mt-1 flex flex-col text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {application.settlementAccount}
                </div>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <div className="text-sm font-medium leading-6 text-gray-900">
                  Loan Terms
                </div>
                <div className="mt-1 flex flex-col text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  <div>Loan Terms: Total Interest of 87139.98</div>
                  <div>Maturity Date: 2041-05-05</div>
                  <div>Interest Rate: 0.0188</div>
                  <div>Monthly Installment: 2795.9</div>
                  <div>Additional Interest: 0.01</div>
                  <div>Monthly Installment Additional: 27.44</div>
                  <div>Total Loan Amount: 587139.0</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
