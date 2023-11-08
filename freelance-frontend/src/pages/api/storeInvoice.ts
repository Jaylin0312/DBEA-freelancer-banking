import type { NextApiRequest, NextApiResponse } from "next"
import { getStorage, ref, uploadBytes } from "firebase/storage"

export const storeInvoice = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method === "POST") return await filePOST(req, res)
  return res.status(400).end()
}

async function filePOST(request: NextApiRequest, res: NextApiResponse) {
  const id = request.query.id as string
  const fileBuffer = request.body
  const originalFilename = request.headers["file-name"] || "uploadedFile"
  const storage = getStorage()

  try {
    const storageRef = ref(storage, `uploads/${id}/${originalFilename}`)
    const { metadata } = await uploadBytes(storageRef, fileBuffer)
    const { fullPath } = metadata

    if (!fullPath) {
      return res.status(403).json({
        error: "There was some error while uploading the file.",
      })
    }

    const fileURL = `https://storage.googleapis.com/${storageRef.bucket}/${fullPath}`
    console.log(fileURL)
    return res.status(200).json({ message: "Uploaded Successfully" })
  } catch (e: any) {
    const tmp = e.message || e.toString()
    console.log(tmp)
    return res.status(500).send(tmp)
  }
}
