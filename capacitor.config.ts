import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.dongseo.campusguide',
  appName: '동서대 캠퍼스맵',
  webDir: 'dist',
  android: {
    allowMixedContent: false,
  },
}

export default config
