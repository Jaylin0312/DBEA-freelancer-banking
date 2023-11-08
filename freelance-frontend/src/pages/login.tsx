import { AuthCard } from "@/components/authCard"

export default function Auth() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center text-5xl text-primary">
      <div className="w-11/12 sm:w-3/5 md:w-96">
        <AuthCard />
      </div>
    </main>
  )
}
