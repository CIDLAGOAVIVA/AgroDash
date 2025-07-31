import Dashboard from '@/components/dashboard';

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="mb-8 text-center sm:text-left">
          <h1 className="text-4xl font-headline font-bold tracking-tight text-primary sm:text-5xl">
            AgriDash
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Your real-time crop monitoring dashboard
          </p>
        </header>
        <Dashboard />
      </div>
    </main>
  );
}
