import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.fittrack.app",
  appName: "FitTrack",
  webDir: "build",
  server: {
    androidScheme: "https"
  }
};

export default config;