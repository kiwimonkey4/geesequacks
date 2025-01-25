import requests
import os
import random 

# Create directory for recordings
os.makedirs("goose_recordings", exist_ok=True)
os.makedirs("other_recordings", exist_ok=True)

# List of other bird genera to compare audio to
negative_data = [
    "Cygnus", "Columba", "Streptopelia", 
    "Corvus", "Turdus", "Parus", "Sturnus", "Passer", 
    "Carduelis", "Spinus", "Emberiza", "Motacilla", "Anthus", 
    "Pica", "Larus", "Aquila", "Falco", "Bubo", 
    "Tyto", "Gallus", "Phasianus", "Meleagris", "Anas", 
    "Spatula", "Aix", "Podiceps", "Fulica", "Grus", 
    "Ardea", "Egretta", "Butorides", "Nycticorax", "Ciconia", 
    "Phoenicopterus", "Pandion", "Milvus", "Accipiter", "Strix", 
    "Caprimulgus", "Apus", "Troglodytes", "Cinclus", "Regulus", 
    "Bombycilla", "Pyrrhula", "Chloris", "Sitta", "Certhia"
]

# Function which extracts and downloads audio data for a given bird
def extract_data(bird):
    api = f"https://xeno-canto.org/api/2/recordings?query=gen:{bird}"
    response = requests.get(api)

    # Handle possible errors (e.g., no data found)
    if response.status_code != 200:
        print(f"Error fetching data for genus {bird}: {response.status_code}")
        return []

    data = response.json()
    recordings = data.get('recordings', [])

    # Randomly select 3 recordings 
    random_recordings = random.sample(recordings, 3)

    # Work with data for each of the selected random recordings
    for recording in random_recordings:
        file_url = recording["file"]  # The file URL
        file_name = f"other_recordings/{recording['id']}.mp3"  # Save as recording ID 

        print(f"Downloading {file_name}...")
        try:
            # Stream the file and save it
            with requests.get(file_url, stream=True) as r:
                r.raise_for_status()  # Raise an error for bad responses (e.g., 404, 500)
                with open(file_name, "wb") as f:
                    for chunk in r.iter_content(chunk_size=8192):
                        f.write(chunk)
            print(f"Downloaded: {file_name}")
        except requests.exceptions.RequestException as e:
            print(f"Failed to download {file_name}: {e}")

# Downloads audio daa for each bird 
'''
for bird in negative_data:
    extract_data(bird)
'''

'''
# API URL for searching canada goose sounds
api_url = "https://xeno-canto.org/api/2/recordings?query=gen:Branta%20canadensis"

# Fetch recordings metadata
response = requests.get(api_url)
data = response.json()

# Download each recording
for recording in data["recordings"]:
    file_url = f"{recording['file']}"
    file_name = f"goose_recordings/{recording['id']}.mp3"
    
    print(f"Downloading {file_name}...")
    with requests.get(file_url, stream=True) as r:
        with open(file_name, "wb") as f:
            for chunk in r.iter_content(chunk_size=8192):
                f.write(chunk)

print("Download complete!")'''