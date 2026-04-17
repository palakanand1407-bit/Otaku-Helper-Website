from flask import Flask, jsonify, send_file
import pandas as pd
import matplotlib.pyplot as plt
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

df = pd.read_csv("C:\\Users\\palak anand\\OneDrive\\Desktop\\Project(PT)\\website\\dataset.csv")
df.columns = df.columns.str.strip().str.lower()

df["score"] = pd.to_numeric(df["score"], errors="coerce")
df["members"] = pd.to_numeric(df["members"], errors="coerce")
df.dropna(subset=["score", "members"], inplace=True)

# http://localhost:5001/top-rated-animes
@app.route("/top-rated-animes", methods=["GET"])
def top_rated_animes():
    if "name" not in df.columns:
        return jsonify({"error": "Column 'name' not found in dataset"}), 500

    top_animes = df.nlargest(5, "score")[["name", "score", "members"]].to_dict(orient="records")
    return jsonify(top_animes)

# http://localhost:5001/popular-genres
@app.route("/popular-genres", methods=["GET"])
def popular_genres():
    if "genres" not in df.columns:
        return jsonify({"error": "Column 'genres' not found in dataset"}), 500

    genre_counts = {}

    for _, row in df.iterrows():
        genres = str(row["genres"]).strip("[]").replace("'", "").split(", ")
        members = int(row["members"]) if pd.notna(row["members"]) else 0

        for genre in genres:
            genre_counts[genre] = genre_counts.get(genre, 0) + members

    sorted_genres = sorted(genre_counts.items(), key=lambda x: x[1], reverse=True)[:5]
    genre_data = [{"Genre": genre, "TotalMembers": members} for genre, members in sorted_genres]
    return jsonify(genre_data)

# ✅ http://localhost:5001/popular-genres-chart
@app.route("/popular-genres-chart", methods=["GET"])
def popular_genres_chart():
    genre_counts = {}

    for _, row in df.iterrows():
        genres = str(row["genres"]).strip("[]").replace("'", "").split(", ")
        members = int(row["members"]) if pd.notna(row["members"]) else 0

        for genre in genres:
            genre_counts[genre] = genre_counts.get(genre, 0) + members

    sorted_genres = sorted(genre_counts.items(), key=lambda x: x[1], reverse=True)[:5]
    labels = [genre for genre, _ in sorted_genres]
    sizes = [members for _, members in sorted_genres]

    plt.figure(figsize=(8, 8))
    plt.pie(sizes, labels=labels, autopct='%1.1f%%', colors=["red", "blue", "green", "purple", "orange"])
    plt.title("Top 5 Popular Anime Genres")

    chart_path = "popular_genres_pie.png"
    plt.savefig(chart_path)
    plt.close()

    return send_file(chart_path, mimetype="image/png")

# ✅ http://localhost:5001/top-favorited-animes
@app.route("/top-favorited-animes", methods=["GET"])
def top_favorited_animes():
    if "name" not in df.columns or "favorites" not in df.columns:
        return jsonify({"error": "Required columns not found in dataset"}), 500

    df["favorites"] = pd.to_numeric(df["favorites"], errors="coerce")
    df.dropna(subset=["favorites"], inplace=True)

    top_fav_animes = df.nlargest(10, "favorites")[["name", "favorites", "score", "members"]].to_dict(orient="records")
    return jsonify(top_fav_animes)


if __name__ == "__main__":
    app.run(port=5001, debug=True)
