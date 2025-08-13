export function Mascot({ className = "" }: { className?: string }) {
  return <div className={`text-6xl animate-bounce-gentle ${className}`}>🦉</div>
}
