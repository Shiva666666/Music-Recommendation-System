import os
import pandas as pd
import joblib
import numpy as np
from tensorflow.keras.models import load_model

# Load dataset
base_dir = os.path.dirname(os.path.abspath(__file__))
df = pd.read_csv("processed_songs.csv")

# Load models
rf_model = joblib.load("rf_model.pkl")
knn_model = joblib.load("knn_model.pkl")
svm_model = joblib.load("svm_model.pkl")
dnn_model = load_model("dnn_model.h5")

moods = sorted(df["mood"].unique())
mood_to_index = {m: i for i, m in enumerate(moods)}

def get_recommendations(mood, model_type):
    filtered = df[df["mood"] == mood]
    if filtered.empty:
        return []

    if model_type == "deep-learning":
        sampled = filtered.sample(n=min(15, len(filtered)))
        X = sampled[["danceability", "energy", "valence"]]
        preds = dnn_model.predict(X, verbose=0)
        scores = preds[:, mood_to_index[mood]]
        sampled["score"] = scores
        top = sampled.sort_values("score", ascending=False).head(5)
        return top[["track_name", "artists"]].to_dict(orient="records")

    else:
        if model_type == "knn":
            model = knn_model
        elif model_type == "random-forest":
            model = rf_model
        elif model_type == "svm":
            model = svm_model
        else:
            raise ValueError(f"Unsupported model type: {model_type}")
        top = filtered.sample(n=5)
    return top[["track_name", "artists"]].to_dict(orient="records")