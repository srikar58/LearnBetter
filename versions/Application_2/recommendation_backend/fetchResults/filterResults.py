from .models import DataDocument
import mongoengine
from django.core.serializers import serialize
import json
from mongoengine import Q
def to_dict(results):
        return {
            'ID': results.ID,
            'Topic': results.Topic,
            'SubTopic': results.SubTopic,
            'Link': results.Link,
            'Category_A': results.Category_A,
            'Category_B': results.Category_B,
            'Summary': results.Summary,
            'Content': results.Content,
        }

def calculate_score(document, search_terms):
    score = 0
    for term in search_terms:
        if term in document.Keywords:
            score += document.Keywords[term]
    return score

def process_filter(search_word):

    search_word_array = search_word.lower().split() #Convert search terms to array
    print(search_word_array)

    query = {'$or': [{'Keywords.' + key: {'$exists': True}} for key in search_word_array]}

    results = DataDocument.objects(__raw__=query)
    print(len(results))

    ranked_results = []
    for doc in results:
        score = calculate_score(doc, search_word_array)
        ranked_results.append((doc, score))

    # ranked_results.sort(key=lambda x: x[1], reverse=True)  # Sort by score in descending order

    for result, score in ranked_results:
        print(f"Document ID: {result.ID} - Match Score: {score}")

    serialized_results = []
    for result, score in ranked_results:
        serialized_result = result.to_mongo().to_dict()
        serialized_result['matchscore']= score
        # serialized_result.pop('_id')
        serialized_results.append(serialized_result)

    # print(type(ranked_results[0][0]))
    # print(serialized_results)
    return serialized_results
