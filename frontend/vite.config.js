import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from 'dotenv';

dotenv.config();

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd());
	return {
		plugins: [react()],
		server: {
			port: 3000,
			proxy: {
				"/api": {
					target: env.VITE_BACKEND_API_URL,
				},
			},
		},
	}
});
