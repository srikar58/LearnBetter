from .models import User, UserActivity, Recommendations
from fetchResults import models as ResultsModels
from mongoengine.queryset import Q
import json
from datetime import datetime, timedelta, timezone


def process_recommendation(user_name, search_term):
    # search_word_array = search_term.lower().split()  # Convert search terms to array
    user_document = User.objects.get(UserName=user_name)
    print(user_document.UserName)
    highest_level = -1

    matching_activities = [
        activity for activity in user_document.Activity if search_term in activity.SearchTerms]

    matching_activities.sort(key=lambda x: len(x.PagesAccessed), reverse=True)

    data_document = None

    for activity in matching_activities:
        categories = next_level(activity.Level, 0)
        data_document = ResultsModels.DataDocument.objects(
            Q(Category_A=categories[0]) & Q(Category_B=categories[1])).first()
        if data_document is None:
            categories = next_level(activity.Level, 1)
            data_document = ResultsModels.DataDocument.objects(
                Q(Category_A=categories[0]) & Q(Category_B=categories[1])).first()
        else:
            break

    # reccomendation = Recommendations(SearchTerm, )

    recommendation = save_recommendation_to_db(search_term, data_document)
    user_document.RecommendationsFeed.append(recommendation)
    user_document.save()

    print({"document": data_document.to_mongo().to_dict(),
           "recommendation_obj": recommendation.to_mongo().to_dict()})

    return {"document": data_document.to_mongo().to_dict(),
            "recommendation_obj": recommendation.to_mongo().to_dict()}


def next_level(level, step):
    catergories = level.split("_")
    if step == 0:
        return [catergories[0], str(int(catergories[1])+1)]
    if (step == 1):
        if "Basic" in catergories[0]:
            return ["Level1", '1']
        else:
            category_a = int(catergories[0].split("vel")[1])
            return ["Level"+str(category_a+1), '1']


def save_recommendation_to_db(search_term, data_document):
    est_offset = timedelta(hours=-4)
    recommendation = Recommendations(
        SearchTerm=search_term, Recommendation=data_document, TimeStamp=datetime.now(timezone(est_offset)))

    recommendation.save()
    return recommendation
