## Table of Contents

- [Description](#description)
- [Technologies Used](#technologies-used)
- [Dataset](#dataset)
- [Installation Instructions](#installation-instructions)
- [Project Structure](#project-structure)
- [How to Run](#how-to-run)
- [Usage](#usage)
- [Model Details](#model-details)
- [Screenshots](#screenshots)
- [Contributors](#contributors)

---

## Description

This project detects the **stage of diabetic retinopathy** using a machine learning model. Users can upload retinal images, and the system predicts one of the following stages:

- No Diabetic Retinopathy (Stage 0)
- Mild Stage
- Moderate Stage
- Severe Stage
- Proliferative Stage

The Flask backend serves the model and handles the user interface requests.

---

## Technologies Used

### Backend:

- Flask (Python web framework)
- Machine Learning Libraries: TensorFlow/Keras, Scikit-learn, NumPy, Pandas

### Frontend:

- HTML/CSS for structure and styling
- JavaScript for interactivity and API calls

---

## Dataset

The model was trained using the **[APTOS 2019 Blindness Detection Dataset](https://www.kaggle.com/c/aptos2019-blindness-detection)**. The dataset contains thousands of retinal images labeled into 5 classes (stages of retinopathy).

---

## Installation Instructions

To run this project locally, follow these steps:

1. Clone this repository:

   ```bash
   git clone <repository-url>
   cd <project-folder>
   ```

2. Create a virtual environment and activate it:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install the dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Ensure you have the pre-trained ML model file (e.g., `model.h5`) in the project directory.

---

## Project Structure

```
Project/
│── static/               # CSS, JavaScript, and images
│── templates/            # HTML files
│── model/                # Trained ML model file
│── app.py                # Flask application
│── requirements.txt      # List of dependencies
└── README.md             # Project documentation
```

---

## How to Run

1. Start the Flask server:

   ```bash
   python app.py
   ```

2. Open your browser and go to:

   ```
   http://127.0.0.1:5000/
   ```

3. Upload an image of the retina to get predictions.

---

## Usage

1. **Open the Web Interface**  
   Access the application on your local server.

2. **Upload Image**  
   Use the upload button to provide a retinal image.

3. **View Prediction**  
   The system will predict and display the stage of diabetic retinopathy.

---

## Model Details

- **Framework**: TensorFlow/Keras
- **Model Type**: Convolutional Neural Network (CNN)
- **Input**: Preprocessed retinal images
- **Output**: Classification into 5 stages

---

## Screenshots

Add screenshots of:

- The home page.
  ![home page](</screenshots/CleanShot 2024-12-18 at 00.14.52@2x.png>)
- Website
  ![website](</screenshots/CleanShot 2024-12-18 at 00.23.51@2x.png>)
- File upload page.
  ![upload section](</screenshots/CleanShot 2024-12-18 at 00.15.27@2x.png>)
- Prediction output.
  ![output](</screenshots/CleanShot 2024-12-18 at 19.56.50@2x.png>)

---

## Contributors

- [Bharath C](https://github.com/BharathC050903)

---
