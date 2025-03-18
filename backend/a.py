import jwt
import time

# Your secret key (ensure this is correct)
secret_key = "your_secret_key"

# Payload with timestamp (ensure the timestamp matches the one you need)
payload = {
    'timestamp': str(int(time.time()))  # or the specific timestamp you need
}

# Create JWT token using HS256 algorithm
token = jwt.encode(payload, secret_key, algorithm='HS256')

print(f"JWT Token: {token}")
