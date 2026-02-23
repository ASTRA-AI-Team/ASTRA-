from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import InputSerializer
from django.http import JsonResponse
import json
import os
import torch
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification, T5Tokenizer, T5ForConditionalGeneration
from difflib import SequenceMatcher

# Load necessary files
if not os.path.exists("./intent_model_2"):
    raise FileNotFoundError("Trained intent model not found in './intent_model_2'.")
if not os.path.exists("new_set_all_intents.json"):
    raise FileNotFoundError("Dataset file 'new_set_all_intents.json' not found.")
if not os.path.exists("intent_mapping_2.json"):
    raise FileNotFoundError("Intent mapping file 'intent_mapping_2.json' not found.")

# Load the trained intent classification model
intent_tokenizer = DistilBertTokenizer.from_pretrained("./intent_model_2")
intent_model = DistilBertForSequenceClassification.from_pretrained("./intent_model_2")
intent_model.eval()

print("Intent model loaded successfully.")

# Load intent mappings
with open("intent_mapping_2.json", "r") as file:
    id_to_intent = {v: k for k, v in json.load(file).items()}

# Load the fine-tuned T5 model for response generation
response_tokenizer = T5Tokenizer.from_pretrained("./fine_tuned_t5")
response_model = T5ForConditionalGeneration.from_pretrained("./fine_tuned_t5")
response_model.eval()
print("Response model loaded successfully.")

# Load dataset for response retrieval
with open("new_set_all_intents.json", "r") as file:
    dataset = json.load(file)
print("josn dataset loaded successfully.")

# Detect device
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
intent_model.to(device)
response_model.to(device)
print(device," allotted successfully.")

# Function to calculate similarity between two strings
def calculate_similarity(a, b):
    return SequenceMatcher(None, a, b).ratio()

# Function for intent prediction
def predict_intent(question):
    inputs = intent_tokenizer(question, return_tensors="pt", truncation=True, padding=True).to(device)
    with torch.no_grad():
        outputs = intent_model(**inputs)
        predicted_id = torch.argmax(outputs.logits, dim=1).item()
        
    return id_to_intent[predicted_id]

# Function for generating response based on intent using T5
def generate_response(question, intent):
    with torch.no_grad():
        if intent == "Greeting and Thank You":
            input_text = f"The user greeted with: '{question}'. Respond warmly in English:"
        else:
            input_text = f"The user asked: '{question}' with the intent '{intent}'. Provide a helpful response in English:"

        print(f"Input to response model: {input_text}")  # Log the input to the response model

        inputs = response_tokenizer(input_text, return_tensors="pt", truncation=True).to(device)
        outputs = response_model.generate(
            inputs["input_ids"], 
            max_length=100, 
            do_sample=True,  
            temperature=0.9, 
            top_k=50, 
            top_p=0.95
        )
        response = response_tokenizer.decode(outputs[0], skip_special_tokens=True)

        print(f"Generated response: {response}")  # Log the generated response

        if len(response.split()) < 3 or "I'm not sure" in response:
            response = "I'm sorry, I couldn't find the exact answer. Could you provide more details?"
        return response

# Function to find a direct answer for a question from the dataset
def find_similar_question(question, intent, threshold=0.7):
    best_match = None
    highest_similarity = threshold
    for item in dataset:
        if item["Intent"] == intent:  
            similarity = calculate_similarity(question.lower(), item["Question"].lower())
            print(f"Similarity between '{question}' and '{item['Question']}': {similarity}")  # Log the similarity score
            
            if similarity > highest_similarity:
                best_match = item
                highest_similarity = similarity
    return best_match

# Function to handle chatbot response (added based on your requirement)
def chatbot_response(request):
    # Extract user input from the request
    if request.method == "POST":
        user_message = request.data.get('message')  # Assuming the user sends a POST request with the 'message' field
        print(f"Received message: {user_message}")  # Log the incoming message
        
        if not user_message:
            return JsonResponse({'error': 'Message is required'}, status=400)
        
        # Step 1: Predict intent
        intent = predict_intent(user_message)
        
        # Step 2: Retrieve response from the dataset
        similar_question = find_similar_question(user_message, intent)
        if similar_question:
            response = similar_question["Answer"]
        else:
            # Step 3: If no similar question, generate response dynamically
            response = generate_response(user_message, intent)
        
        # Return the response as JSON
        return JsonResponse({'reply': response})

# API endpoint for chatbot responses
class ChatbotResponseAPIView(APIView):
    def post(self, request):
        user_message = request.data.get('message')
        print(f"Received message: {user_message}")  # Log the incoming message
        
        if not user_message:
            return Response({"error": "Message is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Step 1: Predict intent
        intent = predict_intent(user_message)
        
        # Step 2: Retrieve response from the dataset
        similar_question = find_similar_question(user_message, intent)
        if similar_question:
            response = similar_question["Answer"]
        else:
            # Step 3: If no similar question, generate response dynamically
            response = generate_response(user_message, intent)

        return Response({'reply': response}, status=status.HTTP_200_OK)

# Views for rendering HTML pages
def index(request):
    return render(request, 'myapp/index.html')

def frontend(request):
    return render(request, 'index.html')
