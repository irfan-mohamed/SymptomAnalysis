import joblib
from flask import Flask, request, jsonify, render_template  # Import render_template
import pandas as pd
import numpy as np

# Define global variables for the model and encoder
model = None
encoder = None

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    global model
    global encoder
    
    # Lazy loading: Load the model and encoder only when the first prediction request is received
    if model is None:
        model = joblib.load('diagnosis_model.pkl')
    if encoder is None:
        encoder = joblib.load('encoder.pkl')
    
    data = request.get_json()
    symptoms = data['symptoms']

    # Convert symptoms to a dataframe
    input_data = pd.DataFrame({'symptom': symptoms})

    # Encode symptoms
    X = encoder.transform(input_data[['symptom']])

    # Make predictions
    predictions = model.predict(X)
    
    # Convert predictions to a list
    predictions_list = predictions.tolist()

    return jsonify({'predictions': predictions_list})

@app.route('/')  # Route to serve index.html
def index():
    return render_template('index.html')  # Render index.html

if __name__ == '__main__':
    app.run(debug=True)
