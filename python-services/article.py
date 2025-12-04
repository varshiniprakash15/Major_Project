# kisangpt/article.py
import streamlit as st
from groq import Groq
import os
import base64

# Set up the Groq API key
os.environ["GROQ_API_KEY"] = "api_key_needed_here"

client = Groq()

def provide_resources(topic, level):
    messages = [
        {
            "role": "system",
            "content": "You are a helpful assistant providing learning resources based on user's level."
        },
        {
            "role": "user",
            "content": f"Provide articles and links for the topic: {topic} suitable for a {level} level learner."
        }
    ]
    response = client.chat.completions.create(
        messages=messages,
        model="llama-3.1-8b-instant",
        temperature=0.7,
        max_tokens=2048,
        top_p=1,
        stream=False,
    )
    return response.choices[0].message.content

# Function to convert image to base64
def get_base64_encoded_image(image_path):
    with open(image_path, "rb") as img_file:
        return base64.b64encode(img_file.read()).decode()

# Path to your icon images
# back_arrow_image_path = 'AL7.png'

# # Encode the icon images
# encoded_back_arrow = get_base64_encoded_image(back_arrow_image_path)


# Convert your background image to base64
background_image_path = 'news.jpg'  # Update with your image path
base64_image = get_base64_encoded_image(background_image_path)

# Inject CSS with base64 background image
st.markdown(
    f"""
    <style>
    .stApp {{
        background-image: url("data:image/jpg;base64,{base64_image}");
        background-size: cover;
        background-position: center;
    }}
    * {{
        color: black;
    }}
    input, textarea {{
        background-color: #fff !important;
        color: #222 !important;
    }}
    input::placeholder {{
        color: #888 !important;
    }}
    select {{
        background-color: #FFF9DB !important;  /* Pale yellow */
        color: #222 !important;
        border: 1px solid #ccc !important;
    }}
    option {{
        background-color: #FFF9DB !important;  /* Pale yellow for dropdown options */
        color: #222 !important;
    }}
    button[kind="primary"] {{
        background-color: #22c55e !important;
        color: #fff !important;
        border: none !important;
        font-weight: bold !important;
    }}
    button[kind="primary"]:hover {{
        background-color: #16a34a !important;
    }}
    </style>
    """,
    unsafe_allow_html=True
)

st.title("Learning Resources Finder")

# User input for learning resources
st.header("Get Learning Resources")
topic_resources = st.text_input("Enter a topic you want resources for:")
level = st.selectbox("Select your level:", ["beginner", "intermediate", "advanced"])

if st.button("Get Resources"):
    if topic_resources and level:
        resources = provide_resources(topic_resources, level)
        st.write(resources)
    else:
        st.write("Please enter a topic and select a level.")