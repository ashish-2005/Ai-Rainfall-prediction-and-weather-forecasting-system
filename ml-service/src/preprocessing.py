import pandas as pd


def load_data(file_path):
    """Load rainfall dataset from Excel."""
    df = pd.read_excel(file_path)

    print(f"Dataset loaded: {df.shape}")

    return df


def preprocess_data(df):
    """Clean dataset and prepare features and target."""

    # Remove rows where target is missing
    df = df.dropna(subset=["rainfall"]).copy()

    # Features available before rainfall prediction
    features = [
        "avg_temp",
        "min_temp",
        "max_temp",
        "wind_speed",
        "air_pressure",
        "elevation",
        "latitude",
        "longitude"
    ]

    target = "rainfall"

    X = df[features].copy()
    y = df[target].copy()

    # Fill missing feature values with median
    X = X.fillna(X.median())

    print(f"Rows after removing missing rainfall: {len(X)}")
    print(f"Features: {features}")

    return X, y