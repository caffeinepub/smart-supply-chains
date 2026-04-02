import { Globe } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  const caffeineLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer className="flex-shrink-0 h-9 flex items-center justify-between px-4 bg-sidebar border-t border-border text-xs text-muted-foreground">
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
        <span>All Systems Operational</span>
        <span className="text-border mx-1">•</span>
        <Globe size={11} />
        <span>ResiliLog v2.4.1</span>
      </div>
      <div className="flex items-center gap-3">
        <span>
          © {year} ResiliLog. Built with ❤ using{" "}
          <a
            href={caffeineLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal hover:underline"
          >
            caffeine.ai
          </a>
        </span>
      </div>
    </footer>
  );
}
