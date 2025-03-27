/* eslint-disable @next/next/next-script-for-ga */
import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="vi">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap"
          rel="stylesheet"
        />
        <script
          id="google-tag-manager"
          dangerouslySetInnerHTML={{
            __html: `
            var timeoutID; 
            setTimeout(function() {
              (function(w,d,s,l,i){
                w[l]=w[l]||[];
                w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
                var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
                j.async=true;
                j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
                f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-KTHCFGD');
            }, 3000);
            
            timeoutID = setTimeout(function() {}, 3000);
            clearTimeout(timeoutID); 
            
            `
          }}
        />
      </Head>
      <body>
        <noscript
          dangerouslySetInnerHTML={{
            __html: `
              <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KTHCFGD"
              height="0" width="0" style="display:none;visibility:hidden"></iframe>
            `
          }}
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
