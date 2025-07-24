# Toxicity Classifier

A web application that uses TensorFlow.js to classify Kanye West quotes for toxicity. Users can test their ability to identify toxic content by guessing whether a quote is toxic before the AI model reveals its classification.

## Project Overview

This application:
- Fetches random Kanye West quotes from a public API
- Uses TensorFlow.js with a pre-trained toxicity classifier model
- Allows users to guess if a quote is toxic
- Compares the user's guess with the AI model's classification
- Provides immediate feedback on the accuracy of the user's judgment

## Prerequisites

- Node.js (v20 or higher)
- npm (v8 or higher)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/philipm15/aai_toxicity_classifier.git
   cd aai_toxicity_classifier
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Running the Application

To start the development server:

```
npm start
```

The application will be available at `http://localhost:4200/` in your web browser.


## How to Use

1. When the application loads, it will initialize the TensorFlow toxicity model
2. Click "Load Quote" to fetch a random Kanye West quote
3. Guess whether you think the quote is toxic by clicking either "Yes, it's toxic" or "No, it's not toxic"
4. The AI model will classify the quote and show you the result
5. Compare your guess with the model's classification
6. Click "Try Another Quote" to continue with a new quote

