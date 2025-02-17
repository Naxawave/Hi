from flask import Flask, request, render_template, redirect, url_for, session, flash
from flask_bcrypt import Bcrypt
from pymongo import MongoClient
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from itsdangerous import URLSafeTimedSerializer as Serializer

app = Flask(__name__)
bcrypt = Bcrypt(app)

# Secret key for sessions
app.secret_key = "advpjsh"

# MongoDB Atlas configuration
client = MongoClient("mongodb+srv://Naxawave:alan2008@hicluster.pqqve.mongodb.net/?retryWrites=true&w=majority&appName=HiCluster")
db = client['Naxawave']  # Name of your database here
collection = db['users']  # Name of your collection here

# SendGrid configuration
SENDGRID_API_KEY = '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'

# Serializer to create and verify tokens
serializer = Serializer(app.secret_key, salt='password-reset-salt')

# Function to send emails
def send_email(recipient, subject, body):
    message = Mail(
        from_email='alanmoralespaliza81@gmail.com',  # Change this to your email
        to_emails=recipient,
        subject=subject,
        html_content=body
    )
    try:
        sg = SendGridAPIClient(SENDGRID_API_KEY)  # Use your SendGrid API key directly
        response = sg.send(message)
        print(f"Email sent successfully! Status code: {response.status_code}")
    except Exception as e:
        print(f"Error sending email: {e}")

@app.route('/')
def home():
    if 'user' not in session:
        return redirect(url_for('login'))
    return redirect(url_for('main_page'))

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']

        # Check if the email is already registered
        if collection.find_one({'email': email}):
            flash("The email is already registered.")
            return redirect(url_for('register'))

        # Hash the password
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

        # Insert user into the database
        collection.insert_one({
            'username': username,
            'email': email,
            'password': hashed_password
        })
        
        session['user'] = username
        return redirect(url_for('main_page'))

    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        # Search for the user in the database
        user = collection.find_one({'username': username})
        
        # Verify if the credentials are correct
        if user and bcrypt.check_password_hash(user['password'], password):
            session['user'] = username
            return redirect(url_for('main_page'))
        else:
            flash("Incorrect username or password.")
            return render_template('login.html')

    return render_template('login.html')

@app.route('/main_page')
def main_page():
    if 'user' not in session:
        return redirect(url_for('login'))
    return render_template('index.html', user=session['user'])

@app.route('/my_profile')
def my_profile():
    if 'user' not in session:
        return redirect(url_for('login'))
    
    username = session['user']
    user_data = collection.find_one({'username': username})
    return render_template('my_profile.html', username=user_data['username'], email=user_data['email'])

@app.route('/recover_password', methods=['GET', 'POST'])
def recover_password():
    if request.method == 'POST':
        email = request.form['email']
        user = collection.find_one({'email': email})

        if user:
            token = serializer.dumps(email, salt='password-reset-salt')
            link = url_for('reset_password', token=token, _external=True)
            subject = "Password Recovery"
            body = f"""
            <p>Hello, we have received a request to reset your password.</p>
            <p>If you did not make this request, please ignore this message.</p>
            <p>To reset your password, click the link below:</p>
            <a href="{link}">Reset Password</a>
            """
            send_email(email, subject, body)
            flash("We have sent you an email to recover your password.", "success")
        else:
            flash("The email is not registered.", "error")

    return render_template('recover_password.html')

@app.route('/reset_password/<token>', methods=['GET', 'POST'])
def reset_password(token):
    try:
        email = serializer.loads(token, salt='password-reset-salt', max_age=3600)
    except:
        flash("The reset link has expired or is invalid.", "error")
        return redirect(url_for('recover_password'))

    if request.method == 'POST':
        new_password = request.form['new_password']
        hashed_password = bcrypt.generate_password_hash(new_password).decode('utf-8')
        collection.update_one({'email': email}, {'$set': {'password': hashed_password}})
        flash("Your password has been successfully reset.", "success")
        return redirect(url_for('login'))

    return render_template('reset_password.html')

@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(debug=True)
