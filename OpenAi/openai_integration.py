import openai
import json
import re
from django.conf import settings

# Initialize OpenAI API
# settings.configure()
openai.api_key = settings.OPENAI_API_KEY

def analyze_cheating_conversation(textMessage):
    prompt = f"""Given the following conversation thread amongst students, check whether there may be cheating involved. Your decision does not need to be perfect and no one will be held accountable whether you are correct or incorrect. Try to minimize false positives as much as possible. With this in mind, output a single number in the range of 0-10, indicating how confident you are that the student (or students) at hand are engaged in academic cheating, with 0 indicating no cheating and 10 indicating absolute certainty of illegal academic conduct. Your output must be a SINGLE integer number in the range of 0-10: {textMessage} This marks the end of the conversation thread. Remember that your output should be a single integer number as it will be parsed by a tool and it must be consistent."""
    
    try:
        response = openai.Completion.create(
            engine="gpt-3.5-turbo-instruct",
            prompt=prompt,
            max_tokens=100,
            temperature=0
        )
        # Extract the response text, which should be a single integer
        response_text = response.choices[0].text.strip()
        return response_text

    except openai.error.OpenAIError as e:
        print(f"Error encountered: {e}")
        return None

    
# stuff for a different project    
def extract_branch(text, email, interests):
    # Split the input text into lines
    lines = text.split('\n')

    # Initialize an empty dictionary to store the data
    data_dict = {}

    data_dict["email"] = email

    data_dict["interests"] = interests

    for line in lines:
        # Use regular expressions to match lines with the format '[Branch Name]: [Brief Branch Description]'
        match = re.match(r'([^:]+):\s(.+)', line)

        if match:
            branch_name, branch_description = match.groups()
            data_dict[branch_name] = branch_description

    json_object = json.dumps(data_dict, indent = 4)

    return json_object

def get_question(user_interest):
    prompt_text = f"Generate a simple question about {user_interest} for someone with little expertise on the field."

    try:
        response = openai.Completion.create(engine="gpt-3.5-turbo-instruct", prompt=prompt_text, max_tokens=1000)
        # Extract the response text
        response_text = response.choices[0].text.strip()
        data_dict = {"question": response_text}
        return json.dumps(data_dict, indent = 4)

    except openai.error.OpenAIError as e:
        print(f"Error encountered: {e}")
        return None

def feedback_ans(stored_question, stored_answer, user_major):
    # Construct a prompt for feedback tailored to the user_major
    prompt_text = f"""For someone with a {user_major} background, provide feedback on the following response and create analogies and connections to {user_major}:\n\nResponse: {stored_answer}\n\nQuestion: {stored_question}
    If the answer to the question is not fully correct, point out inaccuracies and explain in a friendly manner. Limit feedback to 200 characters. Use full sentences."""

    try:
        response = openai.Completion.create(engine="gpt-3.5-turbo-instruct", prompt=prompt_text, max_tokens=1000)
        # Extract the response text
        response_text = response.choices[0].text.strip()
        data_dict = {"feedback": response_text}
        return json.dumps(data_dict, indent = 4)

    except openai.error.OpenAIError as e:
        print(f"Error encountered: {e}")
        return None
    
def explain_more(user_interest, user_major):
    prompt_text = f"""Explain the topic of '{user_interest}' comprehensively. 
    Create analogies and connections to {user_major} where possible to enhance learning experience. :

General Overview. Title field [General Overview:]
[Provide a general overview of the topic in 3 short sentences. ends sentence with a "\n"]

Relationship to your Background. Title field [Background Relationship:]
[Explain how the topic of '{user_interest}' relates to {user_major} in a concise format. ends sentence with a "\n"]

Additional Fields to be Explored. Title field [Further Directions:]
[List 3 bullet points of fields or subtopics related to '{user_interest}' that the user can explore.
Only include the bullet points, do not add their descriptions. ends sentence with a "\n"]

"""

    try:
        response = openai.Completion.create(engine="gpt-3.5-turbo-instruct", prompt=prompt_text, max_tokens=1000)
        # Extract the response text
        response_text = response.choices[0].text.strip()
        data_dict = {"explanation": response_text}
        return json.dumps(data_dict, indent = 4)

    except openai.error.OpenAIError as e:
        print(f"Error encountered: {e}")
        return None
    