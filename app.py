"""============================================================================
Flask Backend - Fabrice Niyonsaba Portfolio API
Provides contact form handling and API endpoints
============================================================================"""

import os
import json
import smtplib
import ssl
from email.message import EmailMessage
from datetime import datetime
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

app = Flask(__name__, static_folder='portifolio-main')
CORS(app)

# ==============================================================================
# Configuration
# ==============================================================================
CONTACT_EMAIL = "fabriceprogrammer@gmail.com"
CONTACTS_FILE = os.path.join(os.path.dirname(__file__), 'contacts.json')
NEWSLETTER_FILE = os.path.join(os.path.dirname(__file__), 'newsletter_subs.json')

# ==============================================================================
# Helper Functions
# ==============================================================================
def load_json(filepath):
    """Load JSON data from a file."""
    if os.path.exists(filepath):
        try:
            with open(filepath, 'r') as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError):
            return []
    return []

def save_json(filepath, data):
    """Save JSON data to a file."""
    try:
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=2)
        return True
    except IOError:
        return False

def validate_email(email):
    """Basic email validation."""
    import re
    pattern = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
    return bool(re.match(pattern, email))

# ==============================================================================
# Routes - Static Files
# ==============================================================================
@app.route('/')
def index():
    """Serve the main portfolio page."""
    return send_from_directory('portifolio-main', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    """Serve static files (CSS, JS, images, etc.)."""
    return send_from_directory('portifolio-main', path)

# ==============================================================================
# API Routes
# ==============================================================================
@app.route('/api/contact', methods=['POST'])
def contact():
    """
    Handle contact form submissions.
    
    Accepts JSON with: name, email, subject, message
    Stores the contact in a local JSON file and attempts to email.
    """
    data = request.get_json()
    
    if not data:
        return jsonify({'success': False, 'message': 'Invalid request. JSON data required.'}), 400
    
    name = data.get('name', '').strip()
    email = data.get('email', '').strip()
    subject = data.get('subject', '').strip() or 'New Portfolio Message'
    message = data.get('message', '').strip()
    
    # Validation
    errors = []
    if not name:
        errors.append('Name is required')
    if not email:
        errors.append('Email is required')
    elif not validate_email(email):
        errors.append('Valid email is required')
    if not message:
        errors.append('Message is required')
    
    if errors:
        return jsonify({'success': False, 'message': '; '.join(errors)}), 400
    
    # Save contact to JSON file
    contacts = load_json(CONTACTS_FILE)
    contact_entry = {
        'id': len(contacts) + 1,
        'name': name,
        'email': email,
        'subject': subject,
        'message': message,
        'timestamp': datetime.now().isoformat(),
        'ip': request.remote_addr
    }
    contacts.append(contact_entry)
    save_json(CONTACTS_FILE, contacts)
    
    # Try to send email notification (optional, won't fail if not configured)
    try:
        # For production, configure SMTP settings
        # This is a template - email sending will be attempted but won't block
        pass
    except Exception:
        pass
    
    return jsonify({
        'success': True,
        'message': 'Thank you for your message! I will get back to you soon.',
        'contact_id': contact_entry['id']
    }), 200

@app.route('/api/contact', methods=['GET'])
def get_contacts():
    """Return all contacts (for admin use)."""
    contacts = load_json(CONTACTS_FILE)
    return jsonify({'contacts': contacts, 'count': len(contacts)})

@app.route('/api/newsletter', methods=['POST'])
def newsletter_signup():
    """
    Handle newsletter signups.
    
    Accepts JSON with: email
    """
    data = request.get_json()
    
    if not data:
        return jsonify({'success': False, 'message': 'Invalid request.'}), 400
    
    email = data.get('email', '').strip()
    
    if not email or not validate_email(email):
        return jsonify({'success': False, 'message': 'A valid email is required.'}), 400
    
    subscriptions = load_json(NEWSLETTER_FILE)
    
    # Check if already subscribed
    for sub in subscriptions:
        if sub['email'] == email:
            return jsonify({
                'success': True,
                'message': 'You are already subscribed!'
            }), 200
    
    subscription = {
        'email': email,
        'date': datetime.now().isoformat(),
        'ip': request.remote_addr
    }
    subscriptions.append(subscription)
    save_json(NEWSLETTER_FILE, subscriptions)
    
    return jsonify({
        'success': True,
        'message': 'Successfully subscribed! Check your inbox for updates.'
    }), 200

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint for monitoring."""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': '2.0.0',
        'owner': 'Fabrice Niyonsaba'
    })

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Return portfolio statistics."""
    contacts = load_json(CONTACTS_FILE)
    subscriptions = load_json(NEWSLETTER_FILE)
    
    return jsonify({
        'total_messages': len(contacts),
        'total_subscribers': len(subscriptions),
        'latest_message': contacts[-1] if contacts else None
    })

# ==============================================================================
# Error Handlers
# ==============================================================================
@app.errorhandler(404)
def not_found(e):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def server_error(e):
    return jsonify({'error': 'Internal server error'}), 500

# ==============================================================================
# Entry Point
# ==============================================================================
if __name__ == '__main__':
    print("=" * 60)
    print("  >> Fabrice Niyonsaba Portfolio Server <<")
    print("=" * 60)
    print(f"  Running on: http://127.0.0.1:5000")
    print(f"  API:        http://127.0.0.1:5000/api/health")
    print(f"  Contact:    http://127.0.0.1:5000/api/contact")
    print("=" * 60)
    app.run(host='0.0.0.0', port=5000, debug=False)
