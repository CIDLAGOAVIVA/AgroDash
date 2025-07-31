import Dashboard from '@/components/dashboard';

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-background text-foreground">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            AgriDash
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Painel de monitoramento agrícola em tempo real
          </p>
        </header>
        <Dashboard />
      </div>
    </main>
  );
}
