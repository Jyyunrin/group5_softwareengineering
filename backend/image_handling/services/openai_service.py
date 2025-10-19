from dotenv import load_dotenv
import os
import base64
import json
from PIL import Image
from openai import OpenAI
from openai.types.responses import Response

# Loading key for openai
load_dotenv()

def get_translation(image_path: str, translation_language: str):
        
       prompt = (
            f"Identify most prominent object in the image and return the following in json format: the object or thing in english " 
            f"and in {translation_language} 'english' and 'translated' respectively, its meaning in english, and example "
            f"sentence in easy, medium, and hard in both english and in {translation_language}, set the json keys to: 'english' for the english translation, "
            f"'translated' for the translated language, 'meaning' for the meaning in english, english-sentence-easy "
            f"for the easy english sentence, 'translated-sentence-easy for the translated language's easy sentence, and the same key format "
            f"for medium and hard sentence but swapping 'easy' with their respective 'med' and 'hard' phrase."
       )

       with Image.open(image_path) as img:
              image_type = img.format.lower()

       print(image_type)
    
       OPENAI_API_KEY=os.getenv("OPENAI_API_KEY")

       # Checks if no open api key, if none then returns previously generated mock response
       if not OPENAI_API_KEY:
              #   raise ValueError("OPEN_API_KEY not found in env variables")
              print("Using mock data content")
              current_dir = os.path.dirname(os.path.abspath(__file__))
              file_path = os.path.join(current_dir, "mock_response.json")

              with open(file_path, "r") as f:
                     data = json.load(f)
       
       else:
              print("Using live generated content")

              # Initialize OpenAI Client with key
              client = OpenAI(api_key = OPENAI_API_KEY)

              # Grab image from volume + encode in base64 (required by OpenAI)
              with open(image_path, "rb") as f:
                     image_bytes = f.read()
              img_base64 = base64.b64encode(image_bytes).decode("utf-8")

              # Send image + text prompt to chatgpt
              response = client.chat.completions.create(
                     model="gpt-4o-mini",
                     response_format={"type": "json_object"},
                     messages=[{
                            "role":"user",
                            "content": [
                                   {"type": "text", "text": prompt},
                                   {"type": "image_url", "image_url": {"url": f"data:image/{image_type};base64,{img_base64}"}}
                            ]
                     }]
              )

              print(response)
              content = response.choices[0].message.content
              print(content)
              data = json.loads(content)

       return data