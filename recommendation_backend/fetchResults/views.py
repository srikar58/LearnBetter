from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .filterResults import process_filter
import json
from bson import json_util
# Create your views here.


@csrf_exempt
def filter_results_api(request):
    if request.method == 'GET':
        print(request.GET)
        search_word = request.GET.get('search_term')

        result = process_filter(search_word)

        # print(type(result[0]))

        serialised_result = json.loads(json_util.dumps(result))
        return JsonResponse(serialised_result, safe=False)
    else:
        return JsonResponse({'error': 'Invalid request method'})
