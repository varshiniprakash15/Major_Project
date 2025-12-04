# kisangpt/chatbotpage.py
import streamlit as st
from groq import Groq
import os
from translatepy import Translate
import base64
import speech_recognition as sr
import nltk
from nltk.corpus import wordnet
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import word_tokenize

# Download the necessary NLTK resources
nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')
nltk.download('wordnet')

# Set up the Groq API key
os.environ["GROQ_API_KEY"] = "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"
client = Groq()
translator = Translate()

lemmatizer = WordNetLemmatizer()

# Supported languages and their codes for translation
languages = {
    'English': 'en',
    'Hindi': 'hi',
    'Bengali': 'bn',
    'Marathi': 'mr',
    'Telugu': 'te',
    'Tamil': 'ta',
    'Gujarati': 'gu',
    'Urdu': 'ur',
    'Kannada': 'kn',
    'Odia': 'or',
    'Malayalam': 'ml'
}

# Recognize speech and identify the language
def recognize_speech(language_code):
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        st.write("Listening...")
        audio = recognizer.listen(source)
        st.write("Recognizing...")
        try:
            text = recognizer.recognize_google(audio, language=language_code, show_all=True)
            if 'alternative' in text:
                transcript = text['alternative'][0]['transcript']
                return transcript
            else:
                return None
        except sr.UnknownValueError:
            st.write("Google Speech Recognition could not understand audio")
            return None
        except sr.RequestError as e:
            st.write(f"Could not request results from Google Speech Recognition service; {e}")
            return None

# Translate text using Translatepy
def translate_text(text, target_language):
    try:
        result = translator.translate(text, target_language)
        return result.result
    except Exception as e:
        st.write(f"Translation error: {e}")
        return text

def get_wordnet_pos(word):
    tag = nltk.pos_tag([word])[0][1][0].upper()
    tag_dict = {"J": wordnet.ADJ, "N": wordnet.NOUN, "V": wordnet.VERB, "R": wordnet.ADV}
    return tag_dict.get(tag, wordnet.NOUN)

# Lemmatize words to get their root form
def lemmatize_text(text):
    words = word_tokenize(text)
    lemmatized_words = [lemmatizer.lemmatize(word, get_wordnet_pos(word)) for word in words]
    return ' '.join(lemmatized_words)

# Set the background image
import base64

# Encode the background image
def encode_image_to_base64(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode()

# Set the background image
def set_bg_image(image_path):
    encoded_string = encode_image_to_base64(image_path)
    st.markdown(
        f"""
        <style>
        .stApp {{
            background: url("data:image/jpg;base64,{encoded_string}") no-repeat center center fixed;
            background-size: cover;
        }}
        input, textarea, select {{
            background-color: #fff !important;
            color: #222 !important;
        }}
        input::placeholder {{
            color: #888 !important;
        }}
        </style>
        """,
        unsafe_allow_html=True
    )

# Call this at the top of your script (after imports)
set_bg_image("farm_bg.jpg")

# Encode the icon image
def encode_image_to_base64(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode()


# Layout for the title and language selection with speech button
st.title("Sustainability and Farming Practices Chatbot")
# Move language and speak button to bottom right
st.markdown('<div class="custom-container">', unsafe_allow_html=True)
selected_language = st.selectbox('Select a language', list(languages.keys()), index=0)
language_code = languages[selected_language]
if st.button("🎤 Speak"):
    user_question = recognize_speech(language_code)
    if user_question:
        st.session_state["user_question"] = user_question
        user_question_translated = translate_text(user_question, 'en').lower()
        st.session_state.messages.append({"role": "user", "content": user_question})
        try:
            response_chunks = []
            response = ""
            prompt = (
                "You are a knowledgeable assistant well-versed in various aspects of sustainability and agriculture. "
                "This includes topics like modern farming techniques, eco-friendly practices, climate change impacts, "
                "crop management, soil health, irrigation methods, sustainable energy solutions, organic farming, and more. "
                "Respond to user questions with concise information (limit your answer to 50-80 words), examples, and practical advice where applicable. "
                "Here is the user's question: "
                f"{user_question_translated}"
            )
            stream = client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": prompt
                    }
                ],
                model="llama-3.1-8b-instant",
                temperature=0.5,
                max_tokens=300,
                top_p=1,
                stop=None,
                stream=True,
            )
            for chunk in stream:
                if hasattr(chunk.choices[0].delta, "content"):
                    content = chunk.choices[0].delta.content
                    if content is not None:
                        response_chunks.append(content)
            final_response = "".join(response_chunks)
            st.session_state.messages.append({"role": "assistant", "content": final_response})
        except Exception as e:
            st.write(f"Error: {e}")
        st.session_state.input_key += 1
        st.session_state.user_question = ""
        st.session_state.user_question_triggered = False
    else:
        st.write("Sorry, could not recognize your speech.")
        st.session_state["user_question"] = ""

st.markdown('</div>', unsafe_allow_html=True)

# Initialize chat history
if 'messages' not in st.session_state:
    st.session_state.messages = []

# Display chat history
for message in st.session_state.messages:
    st.chat_message(message["role"]).markdown(message["content"])

# Initialize input key
if 'input_key' not in st.session_state:
    st.session_state.input_key = 0

# User input
user_question = st.text_input(
    "Enter your question about sustainability and farming practices:",
    key=f"user_input_{st.session_state.input_key}",
    value=st.session_state.get("user_question", ""),
    on_change=lambda: st.session_state.update({"user_question_triggered": True})
)

# Check if the user pressed "Enter" or clicked the "Submit" button
if st.session_state.get("user_question_triggered", False) or st.button("Submit"):
    if user_question:
        user_question_translated = translate_text(user_question, 'en').lower() if selected_language != 'English' else user_question.lower()

        st.session_state.messages.append({"role": "user", "content": user_question})
        try:
            response_chunks = []
            response = ""

            # Updated prompt to broaden the scope
            prompt = (
                "You are a knowledgeable assistant well-versed in various aspects of sustainability and agriculture. "
                "This includes topics like modern farming techniques, eco-friendly practices, climate change impacts, "
                "crop management, soil health, irrigation methods, sustainable energy solutions, organic farming, and more. "
                "Respond to user questions with detailed information, examples, and practical advice where applicable. "
                "Here is the user's question: "
                f"{user_question_translated}"
            )

            stream = client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": prompt
                    }
                ],
                model="llama-3.1-8b-instant",
                temperature=0.5,
                max_tokens=1024,
                top_p=1,
                stop=None,
                stream=True,
            )

            for chunk in stream:
                if hasattr(chunk.choices[0].delta, "content"):
                    content = chunk.choices[0].delta.content
                    if content is not None:
                        response_chunks.append(content)

            final_response = "".join(response_chunks)
            st.chat_message("assistant").markdown(final_response)
            st.session_state.messages.append({"role": "assistant", "content": final_response})

        except Exception as e:
            st.write(f"Error: {e}")
        st.session_state.input_key += 1
        st.session_state.user_question = ""
        st.session_state.user_question_triggered = False
