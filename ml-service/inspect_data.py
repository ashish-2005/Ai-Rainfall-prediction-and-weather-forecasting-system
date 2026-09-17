import pandas as pd

file_path = "data/dataset/india_weather_rainfall_data.xlsx"

df = pd.read_excel(file_path)

print("\n===== DATASET SHAPE =====")
print(df.shape)

print("\n===== COLUMN NAMES =====")
print(df.columns.tolist())

print("\n===== FIRST 5 ROWS =====")
print(df.head().to_string())

print("\n===== DATA TYPES =====")
print(df.dtypes)

print("\n===== MISSING VALUES =====")
print(df.isnull().sum())