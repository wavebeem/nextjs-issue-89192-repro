export const metadata = {
  title: "turbopack double-exec repro",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "monospace", padding: "2rem" }}>
        {children}
      </body>
    </html>
  );
}
