export function SavingsTarget() {
  return (
    <div className="flex w-full flex-col justify-between space-y-2 rounded-lg border p-10">
      <div className="flex items-center justify-between">
        <span className="text-lg">Savings Target</span>
        <span className="text-sm text-green-600">SGD</span>
      </div>
      <div className="text-2xl font-bold">$1,000,000.00</div>
    </div>
  )
}
