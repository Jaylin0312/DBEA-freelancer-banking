export function CurrentBalance() {
  return (
    <div className="flex w-full flex-col justify-between space-y-2 rounded-lg border p-10">
      <div className="flex items-center justify-between">
        <div className="text-lg">Current Balance</div>
        <div className="text-sm text-green-600">SGD</div>
      </div>
      <div className="text-2xl font-bold">$405,091.00</div>
    </div>
  )
}
