export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-mera-neutral-100">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold tracking-tight text-mera-primary">
          Mera Platform
        </h1>
        <p className="text-xl text-mera-neutral-500 max-w-md mx-auto">
          Geleceğin balıkçılık asistanı çok yakında burada olacak. 
          <span className="block mt-2 text-mera-accent font-semibold">Keşfetmeye hazır olun.</span>
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <div className="px-4 py-2 rounded-full bg-mera-status-success/10 text-mera-status-success text-sm font-medium">
            Sistem Aktif
          </div>
          <div className="px-4 py-2 rounded-full bg-mera-status-info/10 text-mera-status-info text-sm font-medium">
            v0.1.0
          </div>
        </div>
      </div>
    </main>
  );
}