#!/bin/bash

echo ""
echo "========================================"
echo "   Praxis Auto Sorter"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo ""
    echo "Please download and install Node.js from:"
    echo "https://nodejs.org/"
    echo ""
    echo "After installing, run this script again."
    exit 1
fi

# Show Node version
echo "Found Node.js:"
node --version
echo ""

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies... (this only happens once)"
    echo ""
    npm install
    if [ $? -ne 0 ]; then
        echo ""
        echo "ERROR: Failed to install dependencies."
        echo "Please check your internet connection and try again."
        exit 1
    fi
    echo ""
    echo "Dependencies installed successfully!"
    echo ""
fi

# Start the server
echo "Starting server..."
echo ""
echo "The app will open in your browser automatically."
echo "Keep this terminal open while using the app."
echo "Press Ctrl+C to stop the server when done."
echo ""
echo "========================================"
echo ""

# Open browser after a short delay (runs in background)
(sleep 2 && open "http://localhost:3000" 2>/dev/null || xdg-open "http://localhost:3000" 2>/dev/null) &

# Run the server (this blocks until Ctrl+C)
node server.js

echo ""
echo "Server stopped."
