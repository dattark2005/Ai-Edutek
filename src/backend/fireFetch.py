import firebase_admin
from firebase_admin import credentials, firestore
import json

# Load service account key
cred = credentials.Certificate("../../serviceAccountKey.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

# Function to fetch Firestore data
def fetch_data():
    collection_name = "quizResults"
    docs = db.collection(collection_name).stream()

    data = {doc.id: doc.to_dict() for doc in docs}

    # Save data as JSON file
    with open("./firestore_data.json", "w") as f:
        json.dump(data, f, indent=4)

    print("Data saved to src/backend/firestore_data.json")

# Run the function
if __name__ == "__main__":
    fetch_data()
