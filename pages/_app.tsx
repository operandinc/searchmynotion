import * as React from "react";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import * as Fathom from "fathom-client";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  useEffect(() => {
    // Initialize Fathom when the app loads
    // Example: yourdomain.com
    //  - Do not include https://
    //  - This must be an exact match of your domain.
    //  - If you're using www. for your domain, make sure you include that here.
    Fathom.load(process.env.NEXT_PUBLIC_FATHOM_SITE_ID as string, {
      includedDomains: ["searchmynotion.com"],
      url: "https://fortunate-van.searchmynotion.com/script.js",
    });

    function onRouteChangeComplete() {
      Fathom.trackPageview();
    }
    // Record a pageview when route changes
    router.events.on("routeChangeComplete", onRouteChangeComplete);

    // Unassign event listener
    return () => {
      router.events.off("routeChangeComplete", onRouteChangeComplete);
    };
  }, []);
  return <Component {...pageProps} />;
}

export default MyApp;
