import type {CapacitorConfig} from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'BuaAndSellGold',
  webDir: 'www',
    server: {
    url: 'http://192.168.1.11:8100',
    cleartext: true,
    allowNavigation: ['192.168.1.11']
  }
  // server: {
  //   cleartext: true,
  //   allowNavigation: ['192.168.1.11'],
  //   scheme: 'http'
  // },

};

export default config;
