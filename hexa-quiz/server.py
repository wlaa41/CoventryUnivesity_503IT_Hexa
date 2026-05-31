"""
Simple local development server for Hexa Cyber Quiz.
Run:  python server.py
Then open:  http://localhost:8080

Adds no-cache headers so browser always loads the latest files.
"""
import http.server
import socketserver
import webbrowser
import os

PORT = 8080
os.chdir(os.path.dirname(os.path.abspath(__file__)))


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    """Serve files but tell the browser not to cache them — vital during development."""

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()


NoCacheHandler.extensions_map.update({
    '.csv': 'text/csv',
    '.js':  'application/javascript',
    '.css': 'text/css',
    '.png': 'image/png',
})

# Allow quick restarts (avoids "address already in use" for ~1 minute after Ctrl+C)
socketserver.TCPServer.allow_reuse_address = True

with socketserver.TCPServer(("", PORT), NoCacheHandler) as httpd:
    url = f"http://localhost:{PORT}"
    print(f"Hexa Cyber Quiz running at {url}")
    print("Press Ctrl+C to stop.\n")
    webbrowser.open(url)
    httpd.serve_forever()
