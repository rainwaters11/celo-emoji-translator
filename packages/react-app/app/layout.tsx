// import '@/styles/globals.css';  // Commented out to eliminate path resolution issues

// Import the AppProvider component from the simplified file 
import { AppProvider } from '../providers/SimpleAppProvider';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Celo Emoji Translator - Transform Text to Emojis on Celo',
  description: 'A fun MiniApp that translates your text into emojis using the Celo blockchain. Create and mint NFTs of your emoji translations!',
  keywords: ['Celo', 'Emoji', 'NFT', 'Blockchain', 'MiniPay', 'Web3', 'Translator'],
  authors: [{ name: 'Celo Emoji Translator Team' }],
  openGraph: {
    title: 'Celo Emoji Translator',
    description: 'Transform your text into beautiful emojis and mint them as NFTs on Celo',
    url: 'https://celo-emoji-translator.vercel.app',
    siteName: 'Celo Emoji Translator',
    images: [
      {
        url: 'https://celo-emoji-translator.vercel.app/logo.svg',
        width: 1200,
        height: 630,
        alt: 'Celo Emoji Translator Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Celo Emoji Translator',
    description: 'Transform your text into beautiful emojis and mint them as NFTs on Celo',
    images: ['https://celo-emoji-translator.vercel.app/logo.svg'],
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': 'https://celo-emoji-translator.vercel.app/logo.svg',
    'fc:frame:button:1': 'Start Translating',
    'fc:frame:post_url': 'https://celo-emoji-translator.vercel.app/api/webhook',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#35D07F" />
      </head>
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
