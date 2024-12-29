import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.example.app",
  appName: "geosense",
  webDir: "out",
  bundledWebRuntime: false,
  server: {
    hostname: "localhost",
    cleartext: true,
    androidScheme: "http",
    allowNavigation: [
      "http://192.168.248.44:5000/*",
      "http://192.168.248.44:5500/*",
      "http://landslide.lalithadithyan.online/*",
    ],
  },
};

export default config;
