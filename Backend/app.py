from flask import Flask, request, jsonify
from flask_cors import CORS
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import smtplib

app = Flask(__name__)
CORS(app)  

SENDER_EMAIL = "fakeecakee813@gmail.com"
APP_PASSWORD = "vmay jtwi nrc jmexc"

def send_email(to_email, subject, body):
    msg = MIMEMultipart()
    msg['From'] = SENDER_EMAIL
    msg['To'] = to_email
    msg['Subject'] = subject

    msg.attach(MIMEText(body, 'plain', 'utf-8'))
    server = smtplib.SMTP("smtp.gmail.com", 587)
    server.starttls()
    server.login(SENDER_EMAIL, APP_PASSWORD)
    # message = f"Subject: {subject}\n\n{body}"
    server.sendmail(SENDER_EMAIL, to_email, msg.as_string())
    server.quit()

@app.route('/send-email', methods=['POST'])
def handle_send_email():
    data = request.json
    candidate_email = data['email']
    status = data['status']

    if status == "selected":
        subject = "🎉 Congratulations!"
        body = "You are selected! Your application is accepted."
    else:
        subject = "Application Update"
        body = "Thank you for applying. Unfortunately, you are not selected."

    try:
        send_email(candidate_email, subject, body)
        return jsonify({"message": "Email sent successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
