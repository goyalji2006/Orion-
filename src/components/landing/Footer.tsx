export default function Footer() {
  return (
    <footer className="w-full text-center py-12 relative z-10 select-none">
      <div className="flex flex-col items-center justify-center gap-2">
        <p className="font-orbitron text-[10px] tracking-[0.3em] text-moon-silver/45 hover:text-neon-cyan/70 transition-colors duration-500 cursor-default">
          Build by Kartikey Goyal
        </p>
        <div className="w-4 h-[1px] bg-neon-cyan/20" />
      </div>
    </footer>
  );
}
