interface DownloadButtonProps {
  href: string;
  label: string;
  icon: string;
  primary?: boolean;
}

export default function DownloadButton({ href, label, icon, primary = false }: DownloadButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (!href) {
      e.preventDefault();
      alert('Link not available yet');
    }
  };

  if (!href) {
    return (
      <button
        onClick={handleClick}
        className={`flex items-center justify-center gap-2 px-6 py-3 rounded-md font-semibold transition-all ${
          primary
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
        }`}
      >
        <span className="text-xl">{icon}</span>
        {label}
      </button>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center justify-center gap-2 px-6 py-3 rounded-md font-semibold transition-all ${
        primary
          ? 'bg-netflix-red hover:bg-red-700 text-white'
          : 'bg-white/10 hover:bg-white/20 text-white border border-white/30'
      }`}
    >
      <span className="text-xl">{icon}</span>
      {label}
    </a>
  );
}