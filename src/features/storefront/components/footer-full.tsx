function CrownIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
      <path d="M3 18h18l-1.5-9-4.5 4-3-6-3 6-4.5-4L3 18z" strokeLinejoin="round" />
      <path d="M5 21h14" strokeLinecap="round" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function WhatsappIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5.1-.1.2-.3.4-.4.1-.1.2-.3.2-.4.1-.2 0-.3 0-.4-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.4c.1.2 1.6 2.5 4 3.5.6.2 1 .4 1.3.5.6.2 1.1.2 1.5.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.1-.2-.2-.4-.3z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M13.5 21v-7.5h2.5l.5-3h-3V8.5c0-.9.25-1.5 1.55-1.5H16.5V4.35C16.2 4.3 15.2 4.2 14 4.2c-2.4 0-4 1.45-4 4.15V10.5H7.5v3H10V21h3.5z" />
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M18.9 3H21l-6.6 7.5L22 21h-6.1l-4.8-6.3L5.6 21H3.5l7-8-8-10h6.2l4.3 5.8L18.9 3zm-1.1 16h1.2L7.3 5H6l11.8 14z" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M22 12s0-3.2-.4-4.7c-.2-.9-.9-1.6-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.5c-.9.2-1.6.9-1.8 1.8C2 8.8 2 12 2 12s0 3.2.4 4.7c.2.9.9 1.6 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.5c.9-.2 1.6-.9 1.8-1.8.4-1.5.4-4.7.4-4.7zM10 15.2V8.8L15.5 12 10 15.2z" />
    </svg>
  );
}

export function FooterFull() {
  return (
    <footer className="relative overflow-hidden bg-navy">
      {/* Aksen gradient pojok kanan bawah — lebih besar sesuai referensi */}
      <div
        className="pointer-events-none absolute -bottom-32 -right-32 size-96 rounded-full opacity-70 blur-2xl"
        style={{
          background: "linear-gradient(135deg, var(--rose-start), var(--rose-end))",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 py-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
        <div className="flex flex-col items-center gap-2">
          <CrownIcon className="size-8 text-olive" />
          <span className="text-xs font-semibold tracking-widest text-navy-foreground">
            JASON JEWELRY
          </span>
        </div>

        <div className="text-sm text-navy-foreground/70 space-y-1">
          <p>jasonjewelry@gmail.com</p>
          <p>Pasar Minggu, Jakarta Selatan</p>
          <p>0812-3456-7890</p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex size-8 items-center justify-center rounded-full border border-navy-foreground/20 text-navy-foreground/70 hover:text-navy-foreground hover:border-navy-foreground/40 transition-colors"
          >
            <InstagramIcon className="size-4" />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex size-8 items-center justify-center rounded-full border border-navy-foreground/20 text-navy-foreground/70 hover:text-navy-foreground hover:border-navy-foreground/40 transition-colors"
          >
            <FacebookIcon className="size-4" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex size-8 items-center justify-center rounded-full border border-navy-foreground/20 text-navy-foreground/70 hover:text-navy-foreground hover:border-navy-foreground/40 transition-colors"
          >
            <TwitterIcon className="size-4" />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex size-8 items-center justify-center rounded-full border border-navy-foreground/20 text-navy-foreground/70 hover:text-navy-foreground hover:border-navy-foreground/40 transition-colors"
          >
            <YoutubeIcon className="size-4" />
          </a>
        </div>
      </div>

      <div className="relative border-t border-navy-foreground/10">
        <p className="mx-auto max-w-6xl px-6 py-4 text-center text-xs text-navy-foreground/50">
          © {new Date().getFullYear()} Jason Jewelry. Seluruh hak cipta dilindungi.
        </p>
      </div>
    </footer>
  );
}