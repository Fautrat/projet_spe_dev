import { config } from 'dotenv';

config({path: '../.env'});

export default {
  server: {
    port: process.env.VITE_PORT,
    headers: {
      'Content-Security-Policy': "script-src 'self'"
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
};
