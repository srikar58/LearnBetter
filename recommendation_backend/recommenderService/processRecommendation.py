from .models import User, UserActivity, Recommendations
from fetchResults import models as ResultsModels
from mongoengine.queryset import Q
import json
from datetime import datetime, timedelta, timezone


def process_recommendation(user_name, search_term):
    # search_word_array = search_term.lower().split()  # Convert search terms to array
    search_term = search_term.lower()
    print(search_term, "_")
    try:
        user_document = User.objects.get(UserName=user_name)
    except:
        return {"Status": False}
    print(user_document.UserName)

    matching_activities = [
        activity for activity in user_document.Activity if search_term in activity.SearchTerms]

    matching_activities.sort(key=lambda x: len(x.PagesAccessed), reverse=True)

    data_document = None
    matched_activity = None
    for activity in matching_activities:
        categories = next_level(activity.Level, 0)
        # print(activity.Topic, categories[0], categories[1])
        data_document = ResultsModels.DataDocument.objects(
            Q(Topic__icontains=activity.Topic) & Q(Category_A=categories[0]) & Q(Category_B=categories[1])).first()
        if data_document is None:
            print("------------------This block is running")
            categories = next_level(activity.Level, 1)
            print(activity.Topic, categories[0], categories[1])
            data_document = ResultsModels.DataDocument.objects(
                Q(Topic__icontains=activity.Topic) & Q(Category_A=categories[0]) & Q(Category_B=categories[1])).first()
            matched_activity = activity
        else:
            matched_activity = activity
            break

    # process_knowledge_level(matched_activity)
    # reccomendation = Recommendations(SearchTerm, )
    if matched_activity is not None and data_document is not None:

        if matched_activity.ActiveRecommendation is not None and matched_activity.ActiveRecommendation.Recommendation == data_document:
            print("-------------------Duplicate Recommendation-----------------")
            return {"document": data_document.to_mongo().to_dict(),
                    "recommendation_obj": matched_activity.ActiveRecommendation.to_mongo().to_dict(), "Status": True}
        else:
            knowledge_level = process_knowledge_level(matched_activity)
            recommendation = save_recommendation_to_db(
                search_term, data_document, knowledge_level)
            matched_activity.ActiveRecommendation = recommendation
            user_document.RecommendationsFeed.append(recommendation)
            user_document.save()
            print("-------------------New Recommendation-------------------")
            return {"document": data_document.to_mongo().to_dict(),
                    "recommendation_obj": recommendation.to_mongo().to_dict(), "Status": True}
    else:
        return {"Status": False}

    print({"document": data_document.to_mongo().to_dict(),
           "recommendation_obj": recommendation.to_mongo().to_dict()})

    # return {"document": data_document.to_mongo().to_dict(),
    #         "recommendation_obj": recommendation.to_mongo().to_dict()}


def next_level(level, step):
    catergories = level.split("_")
    if step == 0:
        return [catergories[0], str(int(catergories[1])+1)]
    if (step == 1):
        if "Basic" in catergories[0]:
            return ["Level 1", '1']
        else:
            category_a = int(catergories[0].split(" ")[1])
            return ["Level "+str(category_a+1), '1']


def save_recommendation_to_db(search_term, data_document, knowledge_level):
    est_offset = timedelta(hours=-4)
    recommendation = Recommendations(
        SearchTerm=search_term, Recommendation=data_document, PredictedKnowledge=knowledge_level, TimeStamp=datetime.now(timezone(est_offset)))

    recommendation.save()
    return recommendation


def process_knowledge_level(activity):
    pages = len(set(activity.PagesAccessed))
    total_pages = ResultsModels.DataDocument.objects(
        Topic=activity.Topic).count()
    print("No of unique pages accessed in this topic is ", pages)
    if pages == 0:
        return 0
    elif pages == 1:
        return 2
    elif pages == 2:
        return 3
    elif pages > 2 and pages < total_pages:
        return 4
    else:
        return 5
    # print("No of unique pages accessed in this topic is ", pages)
