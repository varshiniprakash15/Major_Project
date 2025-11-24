# kisangpt/crop_and_soil_management.py
import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import base64

# Set page config for wide layout
st.set_page_config(layout="wide")

# Function to encode an image to base64
def encode_image_to_base64(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode()

# Path to your icon images
back_arrow_image_path = 'AL4.png'

# Encode the icon images
encoded_back_arrow = encode_image_to_base64(back_arrow_image_path)

# Load the data
file_path = 'crop_and_soil_management_dataset.csv'
data = pd.read_csv(file_path)

# Function to set a background image with white text
def set_bg_image(image_path):
    with open(image_path, "rb") as image_file:
        encoded_string = base64.b64encode(image_file.read()).decode()
    st.markdown(
        f"""
        <style>
        .stApp {{
            background: url("data:image/jpg;base64,{encoded_string}") no-repeat center center fixed;
            background-size: cover;
            color: black; /* Text color */
        }}
        .stApp::before {{
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: inherit;
            opacity: 0.6;
        }}
        .title {{
            font-size: 44px;
            font-weight: bold;
            color: black; /* Title color */
        }}
        .header {{
            font-size: 24px;
            color: black; /* Header color */
        }}
        .stSelectbox label {{
            font-size: 20px;
            color: black !important; /* Dropdown label text color */
        }}
        .description {{
            font-size: 28px;
            color: black; /* Description text color */
        }}
        .details {{
            font-size: 30px; /* Increased font size for details */
            color: black; /* Description text color */
        }}
        .bullet-points {{
            font-size: 20px; /* Adjust font size for bullet points */
            color: black; /* Bullet points color */
        }}
        .back-arrow {{
            position: absolute;
            top: -1590px;
            left: -80px;
            z-index: 1000;
            border-radius: 50%; /* Round shape */
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Shadow effect */
        }}
        .back-arrow img {{
            width: 45px; /* Width of the back arrow icon */
            height: 45px; /* Height of the back arrow icon */
        }}
        </style>
        """,
        unsafe_allow_html=True
    )

# Set the background image
set_bg_image('crop.jpg')

# Set the title
st.markdown('<h1 class="title">Crop and Soil Management Dashboard</h1>', unsafe_allow_html=True)
st.write("""
This dashboard provides insights into soil health and crop disease diagnostics to enhance productivity.
""")

# Define crop information
crop_info = {
    "Wheat": {
        "Description": "Wheat is a cereal grain originally from the Levant region of the Near East and Ethiopian Highlands, but now cultivated worldwide. It is the third most-produced cereal after maize and rice, and it is a staple food for many cultures.",
        "Optimal Growth Conditions": "Temperature: 15-20°C, Rainfall: 30-100 cm, Soil Type: Loamy",
        "Common Diseases": "Rust, Blight, Powdery Mildew"
    },
    "Rice": {
        "Description": "Rice is the seed of the grass species Oryza sativa (Asian rice) or less commonly Oryza glaberrima (African rice). As a cereal grain, it is the most widely consumed staple food for a large part of the world's human population, especially in Asia.",
        "Optimal Growth Conditions": "Temperature: 20-30°C, Rainfall: 100-200 cm, Soil Type: Clayey",
        "Common Diseases": "Blast, Brown Spot, Sheath Blight"
    },
    "Maize": {
        "Description": "Maize, also known as corn, is a cereal grain first domesticated by indigenous peoples in southern Mexico about 10,000 years ago. It has become a staple food in many parts of the world, with total production surpassing that of wheat or rice.",
        "Optimal Growth Conditions": "Temperature: 18-27°C, Rainfall: 50-100 cm, Soil Type: Well-drained loamy",
        "Common Diseases": "Corn Smut, Maize Dwarf Mosaic Virus, Northern Corn Leaf Blight"
    },
    "Soybean": {
        "Description": "Soybean is a species of legume native to East Asia, widely grown for its edible bean, which has numerous uses. Soybeans can be processed into soy protein, tofu, soy milk, and various other products.",
        "Optimal Growth Conditions": "Temperature: 20-30°C, Rainfall: 50-75 cm, Soil Type: Loamy, well-drained",
        "Common Diseases": "Soybean Rust, Root Rot, Soybean Cyst Nematode"
    },
    "Cotton": {
        "Description": "Cotton is a soft, fluffy staple fiber that grows in a boll, or protective case, around the seeds of cotton plants of the genus Gossypium. The fiber is most often spun into yarn or thread and used to make a soft, breathable textile.",
        "Optimal Growth Conditions": "Temperature: 21-30°C, Rainfall: 50-100 cm, Soil Type: Loamy, sandy loam",
        "Common Diseases": "Boll Rot, Wilt Disease, Leaf Spot"
    },
}

# Define soil information
soil_info = {
    "Loamy": {
        "Description": "Loamy soil is a mixture of sand, silt, and clay, and it has ideal properties for farming. It is rich in nutrients, has good drainage, and retains moisture well.",
        "Nutrient Content": "High in nutrients, good water retention",
        "Suitability for Crops": "Suitable for almost all crops, including wheat, maize, and vegetables."
    },
    "Clayey": {
        "Description": "Clayey soil has a high clay content and retains a lot of water. It is sticky when wet and can be very hard when dry.",
        "Nutrient Content": "High in nutrients but poor drainage",
        "Suitability for Crops": "Good for rice, can be improved for other crops with proper management."
    },
    "Sandy": {
        "Description": "Sandy soil has a high proportion of sand particles and is well-drained. It warms up quickly in the spring but has low nutrient content and poor water retention.",
        "Nutrient Content": "Low in nutrients, poor water retention",
        "Suitability for Crops": "Suitable for crops like carrots, potatoes, and peanuts which do not require a lot of nutrients and water."
    },
    "Silt": {
        "Description": "Silt soil is composed of fine particles and has a smooth texture. It retains moisture better than sandy soil and is more fertile but can be prone to erosion.",
        "Nutrient Content": "Moderate to high in nutrients, good water retention",
        "Suitability for Crops": "Suitable for a wide range of crops, including wheat, rice, and vegetables."
    },
    "Peaty": {
        "Description": "Peaty soil is dark brown or black in color, soft, easily compressed due to its high water content, and rich in organic matter. It can retain a lot of moisture and is often acidic.",
        "Nutrient Content": "High in organic matter, poor nutrient availability unless managed",
        "Suitability for Crops": "Suitable for crops like shrubs, legumes, and root crops; can be improved for other crops with proper management and liming."
    },
}

# Filters
st.markdown('<h5 class="header">Select Crop Type:</h5>', unsafe_allow_html=True)
crop_type = st.selectbox('Crop Type', data['Crop Type'].unique())

st.markdown('<h5 class="header">Select Soil Type:</h5>', unsafe_allow_html=True)
soil_type = st.selectbox('Soil Type', data['Soil Type'].unique())

filtered_data = data[(data['Crop Type'] == crop_type) & (data['Soil Type'] == soil_type)]

# Display crop information
crop_details = crop_info.get(crop_type, {})
st.markdown(f"""
    <h3 class="description">Information about {crop_type}</h3>
    <ul class="bullet-points">
        <li><b>Description:</b> {crop_details.get('Description', 'No information available')}</li>
        <li><b>Optimal Growth Conditions:</b> {crop_details.get('Optimal Growth Conditions', 'No information available')}</li>
        <li><b>Common Diseases:</b> {crop_details.get('Common Diseases', 'No information available')}</li>
    </ul>
""", unsafe_allow_html=True)

# Display soil information
soil_details = soil_info.get(soil_type, {})
st.markdown(f"""
    <h3 class="description">Information about {soil_type} Soil</h3>
    <ul class="bullet-points">
        <li><b>Description:</b> {soil_details.get('Description', 'No information available')}</li>
        <li><b>Nutrient Content:</b> {soil_details.get('Nutrient Content', 'No information available')}</li>
        <li><b>Suitability for Crops:</b> {soil_details.get('Suitability for Crops', 'No information available')}</li>
    </ul>
""", unsafe_allow_html=True)

# Layout with 2 graphs side by side and 2 below that side by side
fig1, ax1 = plt.subplots(figsize=(8, 6))
sns.histplot(filtered_data['Soil pH'], kde=True, color="teal", edgecolor="black", ax=ax1)
ax1.set_title('Soil pH Distribution', fontsize=20, color='white')
plt.tight_layout()

# Nutrient Levels Pie Chart
nutrient_sums = filtered_data[['Nitrogen (ppm)', 'Phosphorus (ppm)', 'Potassium (ppm)']].sum()
fig2, ax2 = plt.subplots(figsize=(5, 5))
ax2.pie(nutrient_sums, labels=nutrient_sums.index, autopct='%1.1f%%', colors=sns.color_palette("Set2"))
ax2.set_title(f'Nutrient Levels of {soil_type} for {crop_type} (ppm)', fontsize=20, color='white')
plt.tight_layout()

# Bar graph for Average Yield by Fertilizer Type
fig3, ax3 = plt.subplots(figsize=(8, 6))
average_yield = filtered_data.groupby('Fertilizer Type')['Yield (kg/ha)'].mean().reset_index()
sns.barplot(data=average_yield, x='Fertilizer Type', y='Yield (kg/ha)', hue='Fertilizer Type', palette="coolwarm", ax=ax3)
ax3.set_title('Average Yield by Fertilizer Type', fontsize=20, color='white')
plt.tight_layout()

# Box plot for Fertilizer Amount by Type
fig4, ax4 = plt.subplots(figsize=(8, 6))
sns.boxplot(data=filtered_data, x='Fertilizer Type', y='Fertilizer Amount (kg/ha)', hue='Fertilizer Type', palette="viridis", ax=ax4)
ax4.set_title('Fertilizer Amount by Type', fontsize=20, color='white')
plt.tight_layout()

# Display graphs side by side in two rows
col1, col2 = st.columns(2)
with col1:
    st.pyplot(fig1)
    st.pyplot(fig2)

with col2:
    st.pyplot(fig3)
    st.pyplot(fig4)

# Back arrow at the top left corner
st.markdown(f'''
    <div class="back-arrow">
        <a href="https://kisangpt-6swjrp2hvbgx7l48gqoesh.streamlit.app/
">
            <img src="data:image/png;base64,{encoded_back_arrow}" alt="Back Arrow">
        </a>
    </div>
''', unsafe_allow_html=True)

st.write("""
This dashboard is designed to help farmers make informed decisions about crop and soil management.
""")
