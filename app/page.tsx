export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
      <main className="flex flex-col items-center gap-8 sm:items-start">
        <h1 className="text-center text-4xl font-bold">
          Welcome to Marketplace!
        </h1>
        <p className="text-center text-lg">
          A welcome message
        </p>
      </main>
      <footer className="flex flex-wrap items-center justify-center gap-6">
        A footer
      </footer>
    </div>
  )
}
