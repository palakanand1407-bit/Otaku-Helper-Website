import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score
import joblib

# Load dataset
df = pd.read_csv("C:\\Users\\palak anand\\OneDrive\\Desktop\\Project(PT)\\Mongotut\\Mongo\\quiz\\anime_quiz_dataset_12q_extended.csv")

# 👉 Check class balance
print(df["genre"].value_counts())

# Features and target
X = df.drop("genre", axis=1)
y = df["genre"]

# Encode genre labels
encoder = LabelEncoder()
y_encoded = encoder.fit_transform(y)

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# ✅ Evaluate model accuracy
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"🎯 Model Accuracy: {accuracy * 100:.2f}%")
from sklearn.metrics import classification_report

print(classification_report(y_test, y_pred, target_names=encoder.classes_))
import matplotlib.pyplot as plt

importances = model.feature_importances_
features = X.columns

plt.figure(figsize=(10,6))
plt.barh(features, importances)
plt.xlabel("Importance")
plt.title("Feature Importance")
plt.tight_layout()
plt.show()



# Save model and encoder
joblib.dump(model, "C:\\Users\\palak anand\\OneDrive\\Desktop\\Project(PT)\\Mongotut\\Mongo\\quiz\\anime_genre_model_12q_extended0.pkl")
joblib.dump(encoder, "C:\\Users\\palak anand\\OneDrive\\Desktop\\Project(PT)\\Mongotut\\Mongo\\quiz\\label_encoder_12q_extended0.pkl")

print("✅ Model and encoder saved successfully.")