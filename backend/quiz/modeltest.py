import joblib
import numpy as np

# Load the trained model and encoder
model = joblib.load("C:\\Users\\palak anand\\OneDrive\\Desktop\\Project(PT)\\Mongotut\\Mongo\\quiz\\anime_genre_model_12q_extended0.pkl")
encoder = joblib.load("C:\\Users\\palak anand\\OneDrive\\Desktop\\Project(PT)\\Mongotut\\Mongo\\quiz\\label_encoder_12q_extended0.pkl")

# Sample quiz answers: replace with user input
sample_quiz_answers = np.array([[1, 1, 1, 0, 2, 0, 4, 0, 0, 3, 2, 0]])

# Predict the genre index
predicted_genre_index = model.predict(sample_quiz_answers)[0]

# Decode the genre label
predicted_genre = encoder.inverse_transform([predicted_genre_index])[0]

# Output the result
print("Predicted Genre:", predicted_genre)
