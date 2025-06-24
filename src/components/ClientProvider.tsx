"use client";

import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import CookieConsent from "react-cookie-consent";

import ErrorBoundary from "./ErrorBoundary";

import useAuthToken from "@/hooks/useAuthToken";
import { useInitializeUserData } from "@/stores";

export function ClientProvider({ children }: { children: React.ReactNode }) {
  const { loading } = useAuthToken(process.env.NEXT_PUBLIC_COOKIE_NAME!);
  useInitializeUserData();

  useEffect(() => {
    // Register service worker for PWA support
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").then(
          (registration) => {
            console.log(
              "ServiceWorker registration successful with scope: ",
              registration.scope
            );
          },
          (err) => {
            console.log("ServiceWorker registration failed: ", err);
          }
        );
      });
    }

    function adjustHeight() {
      const vh = window.innerHeight * 0.01;
      console.log(`--vh value is now: ${vh}px`);
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    }

    window.addEventListener("resize", adjustHeight);
    window.addEventListener("orientationchange", adjustHeight);

    // Initial adjustment
    adjustHeight();

    // Cleanup
    return () => {
      window.removeEventListener("resize", adjustHeight);
      window.removeEventListener("orientationchange", adjustHeight);
    };
  }, []);

  useEffect(() => {
    if (window.ReactNativeWebView) {
      document.body.classList.add("noscroll");
    } else {
      document.body.classList.remove("noscroll");
    }

    return () => {
      document.body.classList.remove("noscroll");
    };
  }, []);

  if (loading)
    return (
      <ErrorBoundary>
        <div
          className={`flex flex-col items-center justify-center h-full bg-[#333b51]`}
        >
          <ClipLoader color="#fff" size={80} />
          <p className="mt-4 text-white text-lg">Loading your experience...</p>
        </div>
      </ErrorBoundary>
    );

  return (
    <ErrorBoundary
      fallback={
        <div className="flex flex-col items-center justify-center h-full p-4 bg-red-50 text-red-800">
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p>
            Please try refreshing the page or contact support if the issue
            persists.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      }
    >
      <div className="flex flex-col h-full">
        {children}
        {!window.ReactNativeWebView && (
          <CookieConsent
            buttonText="Accept"
            buttonStyle={{
              backgroundColor: "#1e40af",
              color: "white",
              fontSize: "14px",
              borderRadius: "4px",
            }}
            contentStyle={{ flex: "1 0 300px" }}
          >
            This app uses cookies to enhance the user experience.
          </CookieConsent>
        )}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: "#10B981",
                secondary: "white",
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: "#EF4444",
                secondary: "white",
              },
            },
          }}
        />
      </div>
    </ErrorBoundary>
  );
}
