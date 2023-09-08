from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .filterResults import process_filter
import json
from bson import json_util
from recommenderService import processRecommendation
from .fetchPage import fetchPage
# Create your views here.


@csrf_exempt
def filter_results_api(request):
    if request.method == 'GET':
        print(request.GET)
        search_word = request.GET.get('search_term')
        user = request.headers.get('Username')
        results = process_filter(search_word)
        recommendation = processRecommendation.process_recommendation(
            user, search_word)
        print(type(recommendation))
        print(type(results))

        # print(type(result[0]))
        response = {'results': results, 'recommendation': recommendation}

        serialised_result = json.loads(json_util.dumps(response))
        return JsonResponse(serialised_result, safe=False)
    else:
        return JsonResponse({'error': 'Invalid request method'})


@csrf_exempt
def fetch_result_api(request):
    if request.method == 'GET':
        print(request.GET)
        pageID = request.GET.get('pageID')
        user = request.headers.get('Username')
        result = fetchPage(user, pageID)

        # print(type(result[0]))

        serialised_result = json.loads(json_util.dumps(result))
        return JsonResponse(serialised_result, safe=False)
    else:
        return JsonResponse({'error': 'Invalid request method'})
