from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from bson import json_util
from .processRecommendation import process_recommendation
from .processActivity import process_activity
from .feedback import UpdateFeedback, UpdateRecommendationFeedback
# Create your views here.


@csrf_exempt
def get_recommendation_api(request):
    if request.method == 'POST':
        print(request.POST)
        search_word = request.POST.get('search_term')
        user_name = request.headers.get('Username')

        result = process_recommendation(user_name, search_word)

        # print(type(result[0]))

        serialised_result = json.loads(json_util.dumps(result))
        return JsonResponse(serialised_result, safe=False)
    else:
        return JsonResponse({'error': 'Invalid request method'})


@csrf_exempt
def post_activity_api(request):
    if request.method == 'POST':
        print(request.POST)
        search_word = request.POST.get('search_term')
        user_name = request.headers.get('Username')
        page_accessed = request.POST.get('accessed_page_Id')
        print(user_name)
        print(page_accessed)

        result = process_activity(user_name, search_word, int(page_accessed))

        # print(type(result[0]))

        serialised_result = json.loads(json_util.dumps(result))
        return JsonResponse(serialised_result, safe=False)
    else:
        return JsonResponse({'error': 'Invalid request method'})


@csrf_exempt
def update_feedback_api(request):
    if request.method == 'POST':
        print(request.POST)
        recommendation = json.loads(request.POST.get('recommendation'))
        user_name = request.headers.get('Username')
        rating_feedback = request.POST.get('rating_feedback')
        updated_rating = request.POST.get('updated_rating')
        response = UpdateFeedback(user_name, recommendation, rating_feedback, updated_rating)
        return JsonResponse(response)
    else:
        return JsonResponse({'error': 'Invalid request method'})

@csrf_exempt
def update_recommendation_feedback_api(request):
    if request.method == 'POST':
        print(request.POST)
        recommendation = json.loads(request.POST.get('recommendation'))
        user_name = request.headers.get('Username')
        recommendation_feedback = request.POST.get('recommendation_feedback')
        response = UpdateRecommendationFeedback(user_name, recommendation, recommendation_feedback)
        return JsonResponse(response)
    else:
        return JsonResponse({'error': 'Invalid request method'})