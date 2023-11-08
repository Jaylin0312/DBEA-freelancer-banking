import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function InterestDialog({
  isOpen,
  onClose,
  data,
}: {
  isOpen: boolean
  onClose: () => void
  data: any
}) {
  console.log(data)
  return (
    <div className="z-50">
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) onClose()
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Loan Installment Calculation</DialogTitle>
            <DialogDescription>
              Please read the terms and conditions carefully before proceeding
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-lg">
              Total interest to be paid:{" "}
              <span className="font-bold">{data.Interest}</span>
            </div>
            <div className="text-lg">
              Total monthly installment:{" "}
              <span className="font-bold">{data.MonthlyInstallment}</span>
            </div>
            <div className="space-y-2 rounded-md bg-gray-100 p-3">
              <div className="text-sm font-semibold">Disclaimer:</div>
              <div className="text-sm">
                There is a{" "}
                <span className="font-bold">
                  {(data.AdditionalInterest * 100).toFixed(2)}%
                </span>{" "}
                platform interest rate collected. Interest rate charged by
                Tbanks is{" "}
                <span className="font-bold">
                  {(data.InterestRate * 100).toFixed(2)}%
                </span>
                .
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={onClose}>Acknowledge</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
