from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from bson import json_util
from .processRecommendation import process_recommendation
from .processActivity import process_activity
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
