import { createFilter } from "@rollup/pluginutils";
import react from "@vitejs/plugin-react";
import path from 'path';
import { defineConfig, loadEnv } from "vite";
import circularDependency from 'vite-plugin-circular-dependency';
import compression from "vite-plugin-compression2";

// https://vite.dev/config/

/**
 * Custom string replacement plugin
 * Handles multiple replacement rules with replacements, include, and optional exlude
 * Handles different replacements per file type if needed
 * Example:
 * 		plugins: [
			react(),
			multiStringReplacePlugin([
				{
					replacements: {
						'__IMPORT_CSS': `import './FAQs.scss';`,
						'__ALERT_ME': `alert('hello');`	// function test(){ __ALERT_ME } will be function test() { alert('hello'); }
					},
					include:['src/pages/support/FAQs/FAQs.jsx']
				}
			])
		]
 * 
 * Note: In development, this only replaces the files when served. In production build, it will replace all at once
 * Note: use ticks around values!, do NOT use @@ as a prefix for it causes jsx parsing errors, instead use __name;
 * Note: if the replacement could not be found, the unfound variable could cause issues
 * 
 * @param {JSON} replacementConfigs - the replacement configuration(s)
 * @returns {JSON} - name of the plugin and the transform method
 */
// Example: Include all jsx files - include:['**/*.jsx']
// Example: Includes all files in the support folder - include:['src/pages/support/**/*']
// Example: Include all jsx files except FAQs - include:['**/*.jsx'], exclude:['src/pages/support/FAQs/FAQs.jsx']
// Example: Only include FAQs and Gift - include:['src/pages/support/FAQs/FAQs.jsx', 'src/pages/account/Gift/Gift.jsx']
function multiStringReplacePlugin(replacementConfigs) {
	const verbose = false;

	return {
		name: 'vite-plugin-multi-string-replace',
		transform(code, id) {
			let fileHasMatches = false;
			let totalMatches = 0;
			let totalKeys = 0;

			// Loop through each replacement configuration to find matching files
			for (const { replacements, include, exclude } of replacementConfigs) {
				const filter = createFilter(include, exclude);

				// Only apply replacements if the file matches the filter criteria
				if (!filter(id)) continue;

				if (verbose) console.log(`Processing file: ${id}`);
				totalKeys += Object.keys(replacements).length;

				// Apply each replacement and count matches
				for (const [search, replacement] of Object.entries(replacements)) {
					//code = code.replace(new RegExp(search, 'g'), replacement);
					const searchRegex = new RegExp(search, 'g');
					const matches = [...code.matchAll(searchRegex)].length; // Count occurrences

					// File contains matches, let's replace them
					if (matches > 0) {
						fileHasMatches = true;
						totalMatches += matches;
						if (verbose) console.log(`Found ${matches} occurrence(s) of "${search}" to replace with "${replacement}"`);
						code = code.replace(searchRegex, replacement); // Apply replacement
					}
				}

				// Log no matches found message for all files with 0 matches
				if (!fileHasMatches) {
					if (verbose) console.log(`No matches found for ${Object.keys(replacements).length} keys.`);
				}
			}

			// Log summary for the file, if replacements were made
			if (fileHasMatches) {
				console.log(`Total replacements in ${id}: ${totalMatches} of ${totalKeys}\n`);
				return {
					code,
					map: null, // Use Vite’s default sourcemaps
				};
			} else {
				// Skip processing this file if no replacements were made
				return undefined;
			}
		},
	};
}

/*
npm run build;
npm run preview;
base: 'single_page_application_react/dist/'
base: './'
http://localhost:8888/single_page_application_react/dist/index.html

Not needed in production so leave as is OR remove:
server:{proxy:{...}}

=============================================================================
- DEPLOYMENT

Note: The following 3 configurations are now automatically handled using the 'VITE_BASE_PATH' environment variable in the .env file

vite.config.mjs
set base to: base: '/app/'

index.jsx
set basename of BrowserRouter to basename='/app/'

index.html
<base href='/app/' />

in the root app folder, create a file called .htaccess with the following contents:
RewriteEngine On

RewriteCond %{REQUEST_URI} !\.(css|js|json|png|jpg|jpeg|gif|svg|woff|woff2)$
RewriteCond %{REQUEST_URI} !^/app/index.html$
RewriteRule ^(.*)$ /app/index.html [L,QSA]

- this tells the server to redirect all requests to index.html, allowing React Router to take over
=============================================================================
*/

export default defineConfig(({ command, mode }) => {
	// Ensure the correct environment variables are loaded (process.env.ENV_BASE_NAME is undefined)
	const env = loadEnv(mode, process.cwd(), '');
	const basePath = env.ENV_BASE_NAME;
	const version = env.ENV_APP_VERSION_WEB;

	return {
		base: basePath,
		/*html:{
			cspNonce: 'nonce-1234567890'
		},*/
		css: {
			devSourcemap: true,
			preprocessorOptions: {
				scss: {
					api: 'modern-compiler'	// or modern
				}
			}
		},
		plugins: [
			react(),
			circularDependency(),
			/*compression({
				include: /\.(css|js)$/,			// Include these types of files
				threshold: 1024, 				// Only compress files larger than 1024 bytes
				algorithm: 'gzip', 				// Use gzip compression
				filename: '[path][base].gz', 	 // Define the output filename
				deleteOriginalAssets: false 	// Keep the original assests as a fallback incase gzip is not supported by browser
			}),*/
			{
				name: 'html-transform',
				// Replaces the %BASE_HREF% placeholder in index.html with the value of the VITE_BASE_PATH environment variable
				transformIndexHtml: {
					order: 'post',
					handler(html, ctx) {
						html = html.replaceAll('%BASE_HREF%', basePath);
						return html;
					}
				}
			}
		], 
		envPrefix: 'ENV_',	// Any environment variable prefixed with ENV_ will be exposed using import.meta.env.ENV_YOUR_VARIABLE. Default would be VITE_YOUR_VARIABLE
		resolve: {
			alias: {
				'@': path.resolve(__dirname, './src')	// prefix all root folders with @/ so they get resolved when importing
			}
		},
		server: {
			host: '127.0.0.1',
			port: 3000,
			strictPort: true,
			proxy: {
				'/api': {
					//target: 'http://localhost:80/php-server/',
					target: 'http://localhost:3000/',
					changeOrigin: true
				}
			}
		},
		build: {
			outDir: 'test',
			//assetsInlineLimit:0
			rollupOptions: {
				// This will make the main JS file main.js, the chunk files chunk.js, and the main CSS file main.css.
				// All other files will be named based on their original name or 'index'
				output: {
					//dir: `test/assets/${version}/`,
					// Use main so we know this is the main JS file
					entryFileNames: `assets/${version}/main.[hash].js`,
					// Use chunk so we know this is a chunk JS file otherwise [name] = index
					chunkFileNames: `assets/${version}/chunk.[hash].js`,
					//assetFileNames: `assets/${version}/[name].[hash].[ext]`,
					assetFileNames: (assetInfo) => {
						// If the asset is the main CSS file and it is part of the index.html file, rename it to main.css
						if (assetInfo.name === 'index.css' && assetInfo.originalFileNames?.includes('index.html')) return `assets/${version}/main.[hash].css`;
						return `assets/${version}/[name].[hash].[ext]`
					}
				}
			}
		}
	}
});

/*
build: {
	outDir: 'app',
	//assetsInlineLimit:0
	rollupOptions: {
		output: {
			entryFileNames: `assets/${version}/main.[hash].js`,
			chunkFileNames: `assets/${version}/chunk.[hash].js`,
			assetFileNames: `assets/${version}/[name].[hash].[ext]`,
		}
	}
}
*/

/*
TO use the compressed files on the server...
- use vite-plugin-compression2 plugin
.htaccess
# Enable Gzip compression
<IfModule mod_headers.c>
	# Serve gzipped CSS and JS files if they exist
	RewriteEngine On
	# This condition checks if the client's browser supports gzip encoding by examining the Accept-Encoding HTTP header.
	RewriteCond %{HTTP:Accept-Encoding} gzip
	# This condition checks if the requested file has a .css or .js extension.
	RewriteCond %{REQUEST_FILENAME} \.(css|js)$
	# This condition checks if a gzipped version of the requested file exists on the server. The -f flag checks if the file exists.
	RewriteCond %{REQUEST_FILENAME}.gz -f
	# This rule rewrites the requested URL to serve the gzipped version of the file. The QSA flag appends the query string to the rewritten URL, and the L flag stops further rule processing.
	RewriteRule ^(.*)$ $1.gz [QSA,L]

	# Serve correct Content-Encoding headers for gzipped files
	<FilesMatch "\.gz$">
		# Sets the Content-Encoding header to gzip, indicating that the file is gzip-compressed.
		Header set Content-Encoding gzip
		# Ensures that the Vary header is set correctly for content negotiation.
		Header append Vary Accept-Encoding
	</FilesMatch>
</IfModule>

# Ensure correct MIME types for CSS and JavaScript files
<IfModule mod_mime.c>
	AddType text/css .css
	AddType application/javascript .js
	AddType application/javascript .mjs
</IfModule>

# Serve correct Content-Type headers for gzipped files
<FilesMatch "\.(css|js)\.gz$">
	<If "%{REQUEST_FILENAME} =~ /\.css\.gz$/">
		Header set Content-Type text/css
	</If>
	<If "%{REQUEST_FILENAME} =~ /\.js\.gz$/">
		Header set Content-Type application/javascript
	</If>
</FilesMatch>
*/

/*
To use server-side compression on the server... 
- DO NOT USE vite-plugin-compression2 plugin
.htaccess
# This entire block is to enable gzip compression
<IfModule mod_deflate.c>
	# Filters...
	AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
	AddOutputFilterByType DEFLATE application/xml
	AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
    AddOutputFilterByType DEFLATE image/svg+xml
	
    # Drop Olders Browsers That Can't Handle Compression
    BrowserMatch ^Mozilla/4 gzip-only-text/html
    BrowserMatch ^Mozilla/4\.0[678] no-gzip
    BrowserMatch \bMSIE !no-gzip !gzip-only-text/html
	
    # Make sure proxies don't deliver the wrong content
    Header append Vary User-Agent env=!dont-vary
</IfModule>
*/