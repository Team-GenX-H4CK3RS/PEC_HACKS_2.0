"use client";
import { Work_Sans } from "next/font/google";
import "./globals.css";
import "./global-icons.css";
import { useRouter } from "next/navigation";

const fontWorkSans = Work_Sans({
  subsets: ["latin"],
  display: "swap",
});

const appMenuItems = [
  {
    icon: "smart_toy",
    link: "/med-chatbot",
  },
  {
    icon: "pin_drop",
    link: "/gmap-test",
  },
  {
    icon: "home",
    link: "/",
    isPrimary: true,
  },
  {
    icon: "travel_explore",
    link: "/ngo-search",
  },
  {
    icon: "", // "person",
    link: "/ngo-search",
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  return (
    <html lang="en">
      <body
        className={`${fontWorkSans.className} bg-slate-50 text-slate-800 antialiased`}
      >
        <div className=" h-[100dvh] w-[100dvw] overflow-y-auto overflow-x-hidden pb-[5rem]">
          {children}
        </div>
        <div className="bg-teal-800 text-slate-200 font-semibold text-lg flex items-center p-4 rounded-t-lg absolute bottom-0 inset-x-0 shadow-lg h-20">
          <div className="flex-grow flex items-center justify-around">
            {appMenuItems.map((appMenuItem, i) => (
              <button
                className={`w-12 h-12 flex items-center flex-col justify-center rounded-full transition ${
                  appMenuItem.isPrimary
                    ? "bg-slate-100 text-teal-700"
                    : "bg-transparent text-slate-100 hover:bg-black/20"
                }`}
                onClick={() => router.push(appMenuItem.link)}
                key={i}
              >
                <span
                  className={`material-symbols-rounded text-3xl ${
                    appMenuItem.isPrimary ? "msr-bold" : ""
                  }`}
                >
                  {appMenuItem.icon}
                </span>
              </button>
            ))}
          </div>
        </div>
      </body>
    </html>
  );
}
