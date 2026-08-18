import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { Toaster } from "sonner";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import appCss from "../styles.css?url";
import { RouteAnimationContainer } from "#/components/RouteAnimationContainer";
import { PageNotFound } from "#/components/PageNotFound";
import { ThemeProvider } from "#/hooks/useTheme";

interface MyRouterContext {
  queryClient: QueryClient;
}

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark')?stored:'light';document.documentElement.classList.toggle('dark',mode==='dark');}catch(e){}})();`;

const SPLASH_SEEN_SCRIPT = `(function(){try{var seen=window.sessionStorage.getItem('splash_seen')==='1';document.documentElement.setAttribute('data-splash-seen',seen?'1':'0');}catch(e){document.documentElement.setAttribute('data-splash-seen','0');}})();`;

const SPLASH_SCRIPT = `(function(){var S=document.createElement('div');S.id='splash';var C='#splash{position:fixed;inset:0;z-index:99999;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;background:#ffffff;transition:opacity 0.35s ease}#splash.fade-out{opacity:0;pointer-events:none}#splash .splash-logo{width:64px;height:64px;background:#0b3d91;border-radius:16px;animation:splash-pulse 1.4s ease-in-out infinite}#splash .splash-brand{font-family:Montserrat,sans-serif;font-size:1.5rem;font-weight:800;color:#0a0a0c;letter-spacing:0.04em}#splash .splash-sub{font-family:Inter,sans-serif;font-size:0.8rem;color:#5a5f6b;letter-spacing:0.08em;text-transform:uppercase}html.dark #splash{background:#131417}html.dark #splash .splash-brand{color:#f2f3f5}@keyframes splash-pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.12);opacity:0.75}}';var T=document.createElement('style');T.textContent=C;document.head.appendChild(T);S.innerHTML='<div class=splash-logo></div><span class=splash-brand>ALFA SCORPII</span><span class=splash-sub>Main Dealer Resmi Yamaha</span>';(function(){var P=document.body||document.documentElement;P.insertBefore(S,P.firstChild);})();setTimeout(function(){S.classList.add('fade-out');setTimeout(function(){if(S.parentNode)S.remove()},350)},600)})();`;

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Alfa Scorpii X — Main Dealer Resmi Yamaha" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        {/*<script dangerouslySetInnerHTML={{ __html: SPLASH_SEEN_SCRIPT }} />*/}
        {/* Pindahkan splash script ke head agar dieksekusi sebelum render */}
        {/*<script dangerouslySetInnerHTML={{ __html: SPLASH_SCRIPT }} />*/}
        {/*<link rel="stylesheet" href={appCss} />*/}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Montserrat:wght@600;700;800;900&display=swap"
        />
      </head>
      <body className="bg-paper text-ink antialiased overflow-x-hidden font-body selection:bg-blue selection:text-white">
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: self-contained splash — creates DOM, injects CSS, fades out. React never owns it. */}
        {/*<script dangerouslySetInnerHTML={{ __html: SPLASH_SCRIPT }} />*/}
        <ThemeProvider>{children}</ThemeProvider>
        <Toaster position="bottom-right" />
        {import.meta.env.NODE_ENV === "development" && (
          <TanStackDevtools
            config={{ position: "bottom-right" }}
            plugins={[
              {
                name: "Tanstack Router",
                render: <TanStackRouterDevtoolsPanel />,
              },
              TanStackQueryDevtools,
            ]}
          />
        )}
        <Scripts />
      </body>
    </html>
  );
}
