// This is a hach from github issues, originally found on
// https://dev.to/jlei523/6-tips-using-next-js-for-your-next-web-app-1hhh
// https://github.com/vercel/next.js/issues/3303#issuecomment-628400930

import { useEffect } from "react";
import Router from "next/router";

const saveScrollPos = (url: string) => {
  const scrollPos = { x: window.scrollX, y: window.scrollY };
  sessionStorage.setItem(url, JSON.stringify(scrollPos));
};

const restoreScrollPos = (url: string) => {
  const scrollPos = JSON.parse(sessionStorage.getItem(url));
  if (scrollPos) {
    window.scrollTo(scrollPos.x, scrollPos.y);
  }
};

const useScrollRestoration = (router: any) => {
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      let shouldScrollRestore = false;
      window.history.scrollRestoration = "manual";
      restoreScrollPos(router.asPath);

      const onBeforeUnload = (event: any) => {
        saveScrollPos(router.asPath);
        delete event["returnValue"];
      };

      const onRouteChangeStart = () => {
        saveScrollPos(router.asPath);
      };

      const onRouteChangeComplete = (url: string) => {
        if (shouldScrollRestore) {
          shouldScrollRestore = false;
          restoreScrollPos(url);
        }
      };

      window.addEventListener("beforeunload", onBeforeUnload);
      Router.events.on("routeChangeStart", onRouteChangeStart);
      Router.events.on("routeChangeComplete", onRouteChangeComplete);
      Router.beforePopState(() => {
        shouldScrollRestore = true;
        return true;
      });

      return () => {
        window.removeEventListener("beforeunload", onBeforeUnload);
        Router.events.off("routeChangeStart", onRouteChangeStart);
        Router.events.off("routeChangeComplete", onRouteChangeComplete);
        Router.beforePopState(() => true);
      };
    }
  }, [router]);
};

export default useScrollRestoration;
