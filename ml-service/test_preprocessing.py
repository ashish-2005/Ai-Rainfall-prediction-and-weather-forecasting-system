from src.preprocessing import load_data, preprocess_data


FILE_PATH = "data/dataset/india_weather_rainfall_data.xlsx"


df = load_data(FILE_PATH)

X, y = preprocess_data(df)

print("\n===== X SHAPE =====")
print(X.shape)

print("\n===== Y SHAPE =====")
print(y.shape)

print("\n===== FEATURES =====")
print(X.head())

print("\n===== TARGET =====")
print(y.head())

print("\n===== REMAINING MISSING VALUES =====")
print(X.isnull().sum())