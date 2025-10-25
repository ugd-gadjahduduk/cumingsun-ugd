import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="theme-color" content="#f2f2f5" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="light-content" />
        <meta name="apple-mobile-web-app-title" content="UGD - Coming Soon" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="format-detection" content="telephone=no" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/Manrope_Regular.json" as="fetch" crossOrigin="" />
        <link rel="preconnect" href="https://dl.polyhaven.org" />
        <link rel="preconnect" href="https://rsms.me" />

        {/* Analytics */}
        <script
          defer
          data-website-id="115e0249-c404-4faa-9121-e780efd7c7ac"
          src="https://cloud.umami.is/script.js"
        ></script>
        
        {/* Favicon and icons */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="alternate icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Page title */}
        <title>UGD - Coming Soon</title>
        <meta name="description" content="UGD - Something exciting is coming soon" />
        
        {/* Fonts */}
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        {/* Manrope Font */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>
      <body className="overflow-hidden bg-background font-inter text-black antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
