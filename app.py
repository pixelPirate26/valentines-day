#!/usr/bin/env python3
"""
Valentine's Day - A Romantic Animated Greeting
===============================================
A Python Flask web application featuring a love letter that opens,
Cupid's arrow, blooming hearts, and heartfelt messages.

Usage:
    python app.py
    
Then open http://localhost:5000 in your browser.

Requirements:
    pip install flask
"""

import os
from flask import Flask, render_template, send_from_directory

# Initialize Flask app
app = Flask(__name__, 
            static_folder='static',
            template_folder='templates')

# Configuration
class Config:
    """Application configuration"""
    HOST = '0.0.0.0'
    PORT = 5000
    DEBUG = False
    TITLE = "Happy Valentine's Day 💕"
    
    # Customizable messages - edit these for your special someone!
    MESSAGES = [
        "To the one who makes my heart skip a beat 💕",
        "Every moment with you is a treasure ✨",
        "You are my today and all of my tomorrows 🌹",
        "In your eyes, I found my home 💖",
        "Thank you for being you 💗",
        "Happy Valentine's Day, my love ❤️"
    ]
    
    # Letter text customization
    LETTER_FRONT_TEXT = "For You 💌"
    LETTER_CLICK_TEXT = "Click to Open"

app.config.from_object(Config)


@app.route('/')
def index():
    """Render the main Valentine's Day page"""
    return render_template('index.html', 
                         title=app.config['TITLE'],
                         messages=app.config['MESSAGES'],
                         letter_front_text=app.config['LETTER_FRONT_TEXT'],
                         letter_click_text=app.config['LETTER_CLICK_TEXT'])


@app.route('/static/<path:filename>')
def serve_static(filename):
    """Serve static files"""
    return send_from_directory(app.static_folder, filename)


def main():
    """Main entry point"""
    print("""
    ╔══════════════════════════════════════════════════════════════╗
    ║                                                              ║
    ║     💕  Valentine's Day - Romantic Greeting  💕              ║
    ║                                                              ║
    ║     Open your browser to: http://localhost:5000              ║
    ║                                                              ║
    ║     Press Ctrl+C to stop the server                          ║
    ║                                                              ║
    ╚══════════════════════════════════════════════════════════════╝
    """)
    
    app.run(
        host=Config.HOST,
        port=Config.PORT,
        debug=Config.DEBUG,
        threaded=True
    )


if __name__ == '__main__':
    main()
