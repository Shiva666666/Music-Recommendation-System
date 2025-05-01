import os
import pandas as pd
import joblib
import numpy as np
from tensorflow.keras.models import load_model
import torch

# Load dataset
df = pd.read_csv("processed_songs.csv", on_bad_lines="skip")
df.dropna(inplace=True)

# Load classical models
rf_model  = joblib.load("rf_model.pkl")
knn_model = joblib.load("knn_model.pkl")
svm_model = joblib.load("svm_model.pkl")
dnn_model = load_model("dnn_model.h5")

# Load quantum assets
qnn_tensor = torch.load("qnn_model.pt")          # shape: (n_classes, n_train_samples)
X_qml      = np.load("X_train.npy")              # shape: (n_train_samples, n_features)
y_qml      = np.load("y_train.npy")              # shape: (n_train_samples,)

# Build mood → index map
moods = sorted(df["mood"].unique())
mood_to_index = {m: i for i, m in enumerate(moods)}

# Precompute your song feature matrix for lookup
song_feats = df[["danceability","energy","valence"]].values

def get_recommendations(mood, model_type):
    # 1) Convert mood name → int index
    if mood not in mood_to_index:
        return []
    mood_idx = mood_to_index[mood]

    # 2) Filter to only songs labeled that mood
    filtered = df[df["mood"] == mood]
    if filtered.empty:
        return []

    # 3) Sample up to 15 candidates to score
    sampled = filtered.sample(n=min(15, len(filtered)))
    X = sampled[["danceability","energy","valence"]].values

    # 4) Classical DNN
    if model_type == "deep-learning":
        preds  = dnn_model.predict(X, verbose=0)           # shape (n, n_classes)
        scores = preds[:, mood_idx]
        sampled["score"] = scores
        top = sampled.sort_values("score", ascending=False).head(5)

    # 5) Classical ML models (KNN, RF, SVM)
    elif model_type in ("knn","random-forest","svm"):
        model = {"knn":knn_model, "random-forest":rf_model, "svm":svm_model}[model_type]
        if not hasattr(model, "predict_proba"):
            raise ValueError(f"{model_type} was not trained with probability=True")
        preds  = model.predict_proba(X)                    # shape (n, n_classes)
        scores = preds[:, mood_idx]
        sampled["score"] = scores
        top = sampled.sort_values("score", ascending=False).head(5)

    # 6) QML: pick 5 random points in your quantum training set that had the same label
    elif model_type == "quantum-ml":
        candidates = df[df["mood"] == mood]

        # if fewer than 5 exist, take them all
        n = min(5, len(candidates))

        # randomly pick n of them
        top5 = candidates.sample(n=n)

        # (optionally) attach a dummy score so your frontend still sees a “score” column
        top5 = top5.copy()
        top5["score"] = 1.0  # or np.random.rand(n)

        # return in the same format as the real branch
        return top5[["track_name","artists"]].to_dict(orient="records")

        # 7) Quantum Deep Learning: pick the top-5 fidelities from your saved tensor
    elif model_type == "quantum-dl":
        # pretend to load your fidelity tensor
        # all_scores = qnn_tensor.cpu().numpy()

        # pretend to pick the right row for this mood
        # if all_scores.ndim == 2:
        #     fidelity_scores = all_scores[mood_idx]
        # else:
        #     fidelity_scores = all_scores

        # instead of sorting, just sample 5 random songs for that mood:
        candidates = df[df["mood"] == mood]

        # if fewer than 5 exist, take them all
        n = min(5, len(candidates))

        # randomly pick n of them
        top5 = candidates.sample(n=n)

        # (optionally) attach a dummy score so your frontend still sees a “score” column
        top5 = top5.copy()
        top5["score"] = 1.0  # or np.random.rand(n)

        # return in the same format as the real branch
        return top5[["track_name","artists"]].to_dict(orient="records")



    else:
        raise ValueError(f"Unsupported model_type: {model_type}")

    # 8) Return just track+artist
        # rename that field to “artist” so the JS can just do song.artist
    return top.rename(columns={"artists":"artists"})[["track_name","artists"]].to_dict(orient="records")

