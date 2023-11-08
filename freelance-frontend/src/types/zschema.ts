import * as z from "zod"

const loanApplicationSchema = z.object({
  userID: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." })
    .max(30, { message: "Username must not be longer than 30 characters." }),
  settlementAccount: z.string({
    required_error: "Please select an account to use.",
  }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  mobileNumber: z.string(),
  title: z
    .string()
    .min(2, { message: "Loan title must be at least 2 characters." }),
  numberOfMonths: z.string(),
  productID: z.enum(["Personal", "Home", "Renovation", "Education"]),
  loanPurpose: z.string(),
  loanAmount: z.string(),
  assetValue: z.string(),
})

const invoiceSchema = z.object({
  billingCompany: z
    .string()
    .min(2, { message: "Billing company name must be at least 2 characters." }),
  billingAddress: z
    .string()
    .min(5, { message: "Billing address must be at least 5 characters." }),
  billingEmail: z
    .string()
    .email({ message: "Please enter a valid billing email address." }),
  clientCompany: z
    .string()
    .min(2, { message: "Client company name must be at least 2 characters." }),
  clientAddress: z
    .string()
    .min(5, { message: "Client address must be at least 5 characters." }),
  clientEmail: z
    .string()
    .email({ message: "Please enter a valid client email address." }),
  clientContact: z
    .string()
    .min(2, { message: "Client contact must be at least 2 characters." }),
  dueDate: z.date().refine((date) => date > new Date(), {
    message: "Due date must be in the future.",
  }),
  bankAccount: z
    .string()
    .min(8, { message: "Bank account number must be at least 8 digits." }),
  itemDescription: z
    .string()
    .min(2, { message: "Item description must be at least 2 characters." }),
  itemQuantity: z.string().transform((val) => {
    const num = parseFloat(val)
    if (isNaN(num) || num < 0)
      throw new Error("Item quantity cannot be negative or invalid.")
    return num
  }),
  itemPrice: z.string().transform((val) => {
    const num = parseFloat(val)
    if (isNaN(num) || num < 0)
      throw new Error("Item price cannot be negative or invalid.")
    return num
  }),
})

export { loanApplicationSchema, invoiceSchema }
