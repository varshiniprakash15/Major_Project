# kisangpt/article.py
import streamlit as st
from groq import Groq
import os
import base64

# Set up the Groq API key
os.environ["GROQ_API_KEY"] = "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"

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
back_arrow_image_path = 'AL7.png'

# Encode the icon images
encoded_back_arrow = get_base64_encoded_image(back_arrow_image_path)


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
        color: black !important; /* <-- Force all text to black */
    }}
    .back-arrow {{
            position: absolute;
            top: -440px;
            left: -240px;
            z-index: 1000;
            border-radius: 50%; /* Round shape */
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Shadow effect */
        }}
        .back-arrow img {{
            width: 55px; /* Width of the back arrow icon */
            height: 55px; /* Height of the back arrow icon */
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

# Back arrow at the top left corner
st.markdown(f'''
    <div class="back-arrow">
        <a href="https://kisangpt-6swjrp2hvbgx7l48gqoesh.streamlit.app/">
            <img src="data:image/png;base64,{encoded_back_arrow}" alt="Back Arrow">
        </a>
    </div>
''', unsafe_allow_html=True)
