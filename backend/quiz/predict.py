# predict.py
import sys
import json
import joblib
import numpy as np

def predict_genre(answers):
    # Load the model and encoder
    model = joblib.load("C:\\Users\\palak anand\\OneDrive\\Desktop\\Project(PT)\\Mongotut\\Mongo\\quiz\\anime_genre_model_12q_extended0.pkl")
    encoder = joblib.load("C:\\Users\\palak anand\\OneDrive\\Desktop\\Project(PT)\\Mongotut\\Mongo\\quiz\\label_encoder_12q_extended0.pkl")
    
    # Convert input to numpy array
    answers_array = np.array(answers).reshape(1, -1)
    
    # Make prediction
    genre_encoded = model.predict(answers_array)
    genre = encoder.inverse_transform(genre_encoded)[0]
    
    # Get probabilities for all genres
    probabilities = model.predict_proba(answers_array)[0]
    
    # Create a dictionary of genre probabilities
    genre_probs = {encoder.inverse_transform([i])[0]: float(prob) for i, prob in enumerate(probabilities)}
    
    # Sort by probability (descending)
    sorted_genres = sorted(genre_probs.items(), key=lambda x: x[1], reverse=True)
    
    return {
        "top_genre": genre,
        "all_genres": sorted_genres[:5]  # Return top 5 genres with probabilities
    }

if __name__ == "__main__":
    # Read input from stdin
    input_data = sys.stdin.read()
    answers = json.loads(input_data)
    
    # Make prediction
    result = predict_genre(answers)
    
    # Return result as JSON
    print(json.dumps(result))