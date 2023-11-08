import firebaseApp from "@/firebase/config"
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage"

const storage = getStorage(firebaseApp)

export const storeInvoice = async (
  pdfBlob: any,
  email: string
): Promise<{ status: string; id?: string }> => {
  const storageRef = ref(storage, `invoices/${new Date().toISOString()}.pdf`)
  try {
    await uploadBytes(storageRef, pdfBlob)
    const url = await getDownloadURL(storageRef)
    const tiny_url = await convertTinyURL(url)
    sendEmail(tiny_url, email)
    return { status: "success" }
  } catch (error) {
    throw new Error("Failed to store invoice")
  }
}

export const sendEmail = async (url: string, email: string): Promise<void> => {
  const base_url = process.env.NEXT_PUBLIC_SERVICE_BASE_URL
  const userID = localStorage.getItem("userID")
  const pin = localStorage.getItem("pin")
  const otp = localStorage.getItem("otp")
  const response = await fetch(`${base_url}/invoice/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: {
        userID: userID,
        PIN: pin,
        OTP: otp,
        invoiceURL: url,
        recipientEmail: email,
      },
    }),
  })
  const res = await response.json()
  if (res.status !== "success") {
    throw new Error("Failed to send invoice url")
  }
}

export const convertTinyURL = async (url: string) => {
  const request_url =
    "https://api.tinyurl.com/create?api_token=" +
    process.env.NEXT_PUBLIC_TINYURL_API_KEY

  const response = await fetch(`${request_url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: url,
      domain: "tinyurl.com",
      alias: "",
      tags: [],
      description: "",
    }),
  })
  const res = await response.json()

  return res.data.tiny_url
}
