// import '@/styles/globals.css';  // Commented out to eliminate path resolution issues

// Import the AppProvider component from the simplified file 
import { AppProvider } from '../providers/SimpleAppProvider';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
