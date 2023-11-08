import { ParsedUrlQuery } from "querystring"
import { useEffect, useState } from "react"
import { GetApplicantDetails } from "@/call/userAPI"

export function ApplicantDetails({
  application,
}: {
  application: ParsedUrlQuery
}) {
  const [userDetails, setUserDetails] = useState<any>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchData = async () => {
      const userID =
        typeof application.userID === "string" ? application.userID : ""
      if (!userID) return

      setIsLoading(true)
      try {
        const response = await GetApplicantDetails(userID)
        setUserDetails(response.data)
      } catch (error) {
        console.error("Error fetching user details:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [application.userID])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col gap-4 pt-2">
      <div className="px-4 sm:px-0">
        <div className="pt-2 text-base font-semibold leading-7 text-gray-900">
          Applicant Information
        </div>
        <div className="max-w-2xl pt-1 text-sm leading-6 text-gray-500">
          Applicant&apos;s Personal details and application.
        </div>
      </div>
      <div className="border-t border-gray-100">
        <div className="divide-y divide-gray-100">
          {userDetails && (
            <>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <div className="text-sm font-medium leading-6 text-gray-900">
                  Full name
                </div>
                <div className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {userDetails.givenName} {userDetails.familyName}
                </div>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <div className="text-sm font-medium leading-6 text-gray-900">
                  Address
                </div>
                <div className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {`${userDetails.address.streetAddress1}${
                    userDetails.address.streetAddress2
                      ? `, ${userDetails.address.streetAddress2}`
                      : ""
                  }, ${userDetails.address.city}, ${
                    userDetails.address.state
                  }, ${userDetails.address.postalCode}, ${
                    userDetails.address.country
                  }`}
                </div>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <div className="text-sm font-medium leading-6 text-gray-900">
                  Cell Phone
                </div>
                <div className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  +{userDetails.cellphone.countryCode}{" "}
                  {userDetails.cellphone.phoneNumber}
                </div>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <div className="text-sm font-medium leading-6 text-gray-900">
                  Email
                </div>
                <div className="mt-1 flex flex-col text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {userDetails.profile.email}
                </div>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <div className="text-sm font-medium leading-6 text-gray-900">
                  NRIC / Certificate No.
                </div>
                <div className="mt-1 flex flex-col text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {userDetails.certificate.certificateNo}
                </div>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <div className="text-sm font-medium leading-6 text-gray-900">
                  Profile
                </div>
                <div className="mt-1 flex flex-col text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  <div>Occuptation: {userDetails.profile.occupation}</div>
                  <div>Gender: {userDetails.profile.gender}</div>
                  <div>DOB: {userDetails.dateOfBirth}</div>
                  <div>UserID: {userDetails.additionalUserInfo.userID}</div>
                  <div>
                    Preferred Account:{" "}
                    {userDetails.additionalUserInfo.preferredAccount}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
