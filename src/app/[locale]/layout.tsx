import type { Metadata, Viewport } from 'next';
import { Cairo, Lato } from 'next/font/google';
import { Suspense } from 'react';
import Script from 'next/script';
import { Loader2 } from 'lucide-react';

import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ProfileProvider } from '@/context/ProfileContext';
import { Locale } from '@/i18n.config';
import { Languages, Directions } from '@/constants/enums';
import { GoogleTagManager } from '@next/third-parties/google';

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#4A90E2", // Add theme color for mobile browsers
}

// Fonts
const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  preload: true,
});

const cairo = Cairo({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  preload: true,
});

// Spinner fallback
const Spinner = () => (
  <div className="flex justify-center items-center h-screen w-screen">
    <Loader2 className="animate-spin text-primary" size={48} />
  </div>
);

// Static routes for locales
export async function generateStaticParams() {
  return Object.values(Languages).map((locale) => ({ locale }));
}

// Metadata generator
export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const locale = (await params).locale;

  const shared = {
  metadataBase: new URL('https://melaaka.com'),
    icons: {
      icon: '/favicon.ico',
      apple: '/apple-icon.png',
      shortcut: '/favicon-16x16.png', // Add shortcut icon
      other: [
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      ],
    },
    // alternates will be adjusted per-locale below so canonical/hreflang point to the
    // correct localized path (e.g. /en or /ar). Next.js will resolve these relative
    // to metadataBase.
    alternates: {
      canonical: '/',
      languages: {
        en: '/en',
        ar: '/ar',
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION, // Add Google Search Console verification
    },
  authors: [{ name: 'Melaaka' }], // Add author information
    category: 'online marketplace',
  };

  // Ensure alternates.canonical points to the locale root (so canonical is locale-aware)
  // and keep languages mapping in standard two-letter codes so hreflang tags are generated
  // correctly by Next.js. We mutate shared here because generateMetadata runs per-locale.
  shared.alternates = {
    canonical: `/${locale}`,
    languages: {
      en: '/en',
      ar: '/ar',
    },
  };

  // Basic robots defaults applied to all pages; can be overridden per-page if needed.
  // This helps ensure search engines index/follow the site and offers Google-specific options.
  // Next.js will render appropriate <meta name="robots" ...> and <meta name="googlebot" ...> tags.
  const defaultRobots = {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-video-preview': -1,
      'max-snippet': -1,
    },
  } as const;

  if (locale === Languages.ARABIC) {
    return {
      ...shared,
      robots: defaultRobots,
      title: {
  default: 'Melaaka | أسرع طريقة للبيع والشراء في الإمارات',
  template: '%s | Melaaka',
      },
      description:
  'بع بسرعة وسهولة في الإمارات مع Melaaka! أسرع طريقة لبيع السيارات، الإلكترونيات، الأزياء والمزيد في دبي وجميع أنحاء الإمارات. بدون عمولة وبأسعار اشتراك منخفضة.',
      keywords: [
        'شراء وبيع في الإمارات', 'سوق إلكتروني', 'بيع سيارات في دبي',
  'شراء إلكترونيات مستعملة', 'بيع ملابس مقابل النقد', 'بيع أثاث مستعمل', 'Melaaka', 'ميلاكا',
        'سوق دبي', 'موقع إعلانات مجاني', 'سوق أبو ظبي', 'بدون عمولة'
      ],
      openGraph: {
  title: 'Melaaka | أسرع طريقة للبيع والشراء في الإمارات',
        description:
      'بع بسرعة وسهولة في الإمارات مع Melaaka! أسرع طريقة لبيع السيارات، الإلكترونيات، الأزياء والمزيد. بدون عمولة وبأسعار اشتراك منخفضة.',
  url: 'https://melaaka.com/ar',
  siteName: 'Melaaka',
        locale: 'ar_AE',
        type: 'website',
        images: [
          {
            url: 'https://melaaka.com/og-image.png',
            width: 1200,
            height: 630,
            alt: 'Melaaka - سوق الإمارات',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Melaaka | سوق الإمارات الإلكتروني',
        description: 'سوق الإمارات الإلكتروني الرائد - بيع واشتري بسهولة وأمان',
  images: ['https://melaaka.com/twitter-image-ar.jpg'],
      },
    };
  }

  return {
    ...shared,
    robots: defaultRobots,
    title: {
  default: 'Melaaka | Fastest Way to Buy & Sell in UAE',
  template: '%s | Melaaka',
    },
    description:
  'Sell Fast & Easy in UAE with Melaaka! The fastest way to sell cars, electronics, fashion, and more in Dubai and across the UAE. Commission-free with the cheapest subscription rates.',
    keywords: [
      'Buy and sell in UAE', 'Online marketplace UAE', 'Sell cars fast in Dubai',
  'Cash for phones UAE', 'Sell clothes online', 'Used furniture UAE','Melaaka',
      'Cheap phones UAE', 'Cheap cars UAE', 'Dubai marketplace', 'Abu Dhabi classifieds',
      'Second hand items UAE', 'Commission-free marketplace'
    ],
    openGraph: {
  title: 'Melaaka | Fastest Way to Buy & Sell in UAE',
      description:
        "Sell Fast & Easy in UAE with Melaaka! The fastest way to sell cars, electronics, fashion, and more in Dubai and across the UAE. Enjoy the cheapest subscription rates and reach trusted buyers instantly.",
      url: 'https://melaaka.com/en',
      siteName: 'Melaaka',
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: 'https://melaaka.com/og-image.png',
          width: 1200,
          height: 630,
          alt: 'Melaaka - UAE Marketplace',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
  title: 'Melaaka | UAE Marketplace',
      description: 'Leading UAE online marketplace - Buy & sell easily and safely',
  images: ['https://melaaka.com/twitter-image.jpg'],
    },
  };
}

// Main layout
export default async function RootLayout({
  params,
  children,
}: Readonly<{
  params: Promise<{ locale: Locale }>;
  children: React.ReactNode;
}>) {
  const locale = (await params).locale;
  const isArabic = locale === Languages.ARABIC;

  return (
    <html lang={locale} dir={isArabic ? Directions.RTL : Directions.LTR}>
      <head>
        {/* Preconnect to important domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

        {/* Manifest file for PWA */}
        <link rel="manifest" href="/manifest.json" />
      </head>

      {/* Structured Data for Organization */}
      <Script
        id="structured-data-organization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Melaaka',
            url: 'https://melaaka.com',
            logo: 'https://melaaka.com/logo.png',
            sameAs: [
              'https://www.facebook.com/melaaka',
              'https://www.instagram.com/melaaka.com',
              'https://twitter.com/melaaka'
            ],
            contactPoint: {
              '@type': 'ContactPoint',
              contactType: 'customer service',
              availableLanguage: ['English', 'Arabic']
            }
          })
        }}
      />

      {/* Structured Data for WebSite */}
      <Script
        id="structured-data-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Melaaka',
            url: 'https://melaaka.com',
            potentialAction: {
              '@type': 'SearchAction',
              target: 'https://melaaka.com/search?q={search_term_string}',
              'query-input': 'required name=search_term_string'
            }
          })
        }}
      />

      {/* TikTok Pixel */}
      <Script id="tiktok-pixel" strategy="afterInteractive">
        {`
          !function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];
          ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"];
          ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)));}};
          for(var i=0;i<ttq.methods.length;i++){ttq.setAndDefer(ttq,ttq.methods[i]);}
          ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js";
          var o=n&&n.partner;ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=r;ttq._t=ttq._t||{};ttq._t[e]=+new Date;
          ttq._o=ttq._o||{};ttq._o[e]=n||{};var script=document.createElement("script");
          script.type="text/javascript";script.async=true;script.src=r+"?sdkid="+e+"&lib="+t;
          var firstScript=document.getElementsByTagName("script")[0];firstScript.parentNode.insertBefore(script,firstScript);};
          ttq.load('CVLTPQBC77UCTQ7C5C5G');ttq.page();
        `}
      </Script>

      <GoogleTagManager gtmId={process.env.gtmId || 'GTM-XYZ'} />

      <body className={isArabic ? cairo.className : lato.className}>
        <ProfileProvider>
          <Suspense fallback={<Spinner />}>
            {children}
          </Suspense>
        </ProfileProvider>
        <Toaster />
      </body>
    </html>
  );
}

// export const metadata: Metadata = {
//   title: {
//     default: 'شروع - المنصة العربية الأولى في إدارة المشاريع',
//     template: '%s | شروع',
//   },
//   description: 'المنصة العربية الرائدة في إدارة المشاريع، والقيادة، والتحول، والابتكار، والتميز المؤسسي، والحوكمة، والاستراتيجية',
//   keywords: [
//     'ريادة الأعمال',
//     'الابتكار',
//     'القيادة',
//     'التحول الرقمي',
//     'التقنيات الناشئة',
//     'الشركات الناشئة',
//     'الاستثمار',
//     'التطوير',
//   ],
//   authors: [{ name: 'شروع للنشر الرقمي' }],
//   creator: 'شروع للنشر الرقمي',
//   publisher: 'شروع للنشر الرقمي',

//   // Open Graph metadata
//   openGraph: {
//     type: 'website',
//     locale: 'ar_SA',
//     url: 'https://yoursite.com', // Replace with your actual domain
//     siteName: 'شروع',
//     title: 'شروع - المنصة العربية الأولى في إدارة المشاريع',
//     description: 'المنصة العربية الرائدة في إدارة المشاريع، والقيادة، والتحول، والابتكار، والتميز المؤسسي، والحوكمة، والاستراتيجية',
//     images: [
//       {
//         url: '/og-image.jpg', // Main OG image (1200x630px recommended)
//         width: 1200,
//         height: 630,
//         alt: 'شروع - المنصة العربية الأولى في إدارة المشاريع',
//       },
//       {
//         url: '/og-image-square.jpg', // Square image for some platforms (1200x1200px)
//         width: 1200,
//         height: 1200,
//         alt: 'شروع - المنصة العربية الأولى في إدارة المشاريع',
//       },
//     ],
//   },

//   // Twitter metadata
//   twitter: {
//     card: 'summary_large_image',
//     site: '@YourTwitterHandle', // Replace with your Twitter handle
//     creator: '@YourTwitterHandle', // Replace with your Twitter handle
//     title: 'شروع - المنصة العربية الأولى في إدارة المشاريع',
//     description: 'المنصة العربية الرائدة في إدارة المشاريع، والقيادة، والتحول، والابتكار، والتميز المؤسسي، والحوكمة، والاستراتيجية',
//     images: ['/twitter-image.jpg'], // Twitter image (1200x600px recommended)
//   },

//   // Additional metadata
//   robots: {
//     index: true,
//     follow: true,
//     googleBot: {
//       index: true,
//       follow: true,
//       'max-video-preview': -1,
//       'max-image-preview': 'large',
//       'max-snippet': -1,
//     },
//   },

//   // Verification tags (add your actual verification codes)
//   verification: {
//     google: 'your-google-verification-code',
//     yandex: 'your-yandex-verification-code',
//     // Other verification services as needed
//   },

//   // Alternate languages
//   alternates: {
//     canonical: 'https://yoursite.com', // Replace with your actual domain
//     languages: {
//       'ar': 'https://yoursite.com',
//       'en': 'https://yoursite.com/en', // If you have English version
//     },
//   },

//   // Additional meta tags
//   other: {
//     // Facebook App ID (if you have one)
//     'fb:app_id': 'your-facebook-app-id',

//     // Apple mobile web app
//     'apple-mobile-web-app-capable': 'yes',
//     'apple-mobile-web-app-status-bar-style': 'default',
//     'apple-mobile-web-app-title': 'شروع',

//     // Microsoft application
//     'msapplication-TileColor': '#ffffff',
//     'msapplication-TileImage': '/ms-icon-144x144.png',

//     // Theme color
//     'theme-color': '#ffffff',

//     // Robots
//     'revisit-after': '7 days',

//     // Language and direction
//     'content-language': 'ar',
//     'dir': 'rtl',
//   },

//   // Icons
//   icons: {
//     icon: [
//       { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
//       { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
//       { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
//     ],
//     apple: [
//       { url: '/apple-icon-57x57.png', sizes: '57x57', type: 'image/png' },
//       { url: '/apple-icon-60x60.png', sizes: '60x60', type: 'image/png' },
//       { url: '/apple-icon-72x72.png', sizes: '72x72', type: 'image/png' },
//       { url: '/apple-icon-76x76.png', sizes: '76x76', type: 'image/png' },
//       { url: '/apple-icon-114x114.png', sizes: '114x114', type: 'image/png' },
//       { url: '/apple-icon-120x120.png', sizes: '120x120', type: 'image/png' },
//       { url: '/apple-icon-144x144.png', sizes: '144x144', type: 'image/png' },
//       { url: '/apple-icon-152x152.png', sizes: '152x152', type: 'image/png' },
//       { url: '/apple-icon-180x180.png', sizes: '180x180', type: 'image/png' },
//     ],
//     other: [
//       {
//         rel: 'android-chrome',
//         url: '/android-icon-192x192.png',
//         sizes: '192x192',
//         type: 'image/png',
//       },
//     ],
//   },
// }