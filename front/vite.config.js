import { config } from 'dotenv';

config();

export default {
  server: {
    port: process.env.VITE_PORT,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
};
