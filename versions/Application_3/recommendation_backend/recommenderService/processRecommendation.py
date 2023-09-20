from .models import User, UserActivity, Recommendations
from fetchResults import models as ResultsModels
from mongoengine.queryset import Q
import json
from datetime import datetime, timedelta, timezone
from fetchResults import models as ResultsModels


def process_recommendation(user_name, search_term):
    # search_word_array = search_term.lower().split()  # Convert search terms to array
    search_term = search_term.lower()
    print(search_term, "_ Recommendation process")
    try:
        user_document = User.objects.get(UserName=user_name)
    except:
        user_document = User(UserName=user_name)
        user_document.save()
        print("Registered a new User: ", user_name)
    print(user_document.UserName)

    matching_activities = [
        activity for activity in user_document.Activity if search_term in activity.SearchTerms]

    if (len(matching_activities) == 0):
        data_document = fetch_results(search_term)
        matching_activity = [activity for activity in user_document.Activity if data_document.Topic == activity.Topic]
        if(len(matching_activity)==0):
            knowledge_level = 0
            recommendation = save_recommendation_to_db(
                search_term, data_document, knowledge_level)
            save_new_user_to_db(user_name, search_term,
                                recommendation, "Basic_1", data_document)
            print("-------------------New Recommendation-------------------")
            return {"document": data_document.to_mongo().to_dict(),
                    "recommendation_obj": recommendation.to_mongo().to_dict(), "Status": True}
        elif matching_activity[0].ActiveRecommendation is not None and matching_activity[0].ActiveRecommendation.Recommendation == data_document:
            matching_activity[0].SearchTerms.append(search_term)
            user_document.save()
            print("-------------------Duplicate Recommendation-----------------")
            return {"document": data_document.to_mongo().to_dict(),
                    "recommendation_obj": matching_activity[0].ActiveRecommendation.to_mongo().to_dict(), "Status": True}
        elif matching_activity[0] is not None:
            matching_activity[0].SearchTerms.append(search_term)
            user_document.save()
            matching_activities.append(matching_activity[0])

    matching_activities.sort(key=lambda x: len(x.PagesAccessed), reverse=True)

    data_document = None
    matched_activity = None
    for activity in matching_activities:
        categories = next_level(activity.Level, 0)
        # print(activity.Topic, categories[0], categories[1])
        data_document = ResultsModels.DataDocument.objects(
            Q(Topic__icontains=activity.Topic) & Q(Category_A=categories[0]) & Q(Category_B=categories[1])).first()
        if data_document is None:
            # print("------------------This block is running")
            categories = next_level(activity.Level, 1)
            print(activity.Topic, categories[0], categories[1])
            data_document = ResultsModels.DataDocument.objects(
                Q(Topic__icontains=activity.Topic) & Q(Category_A=categories[0]) & Q(Category_B=categories[1])).first()
            matched_activity = activity
        else:
            matched_activity = activity
            break
        # if data_document is None:
        #     return

    # process_knowledge_level(matched_activity)
    # reccomendation = Recommendations(SearchTerm, )
    if matched_activity is not None and data_document is not None:
        if(matched_activity.RecommendationsViewed == 3):
            data_document = matched_activity.RecommendationsAccessed[0].Recommendation


        if matched_activity.ActiveRecommendation is not None and matched_activity.ActiveRecommendation.Recommendation == data_document:
            print("-------------------Duplicate Recommendation-----------------")
            return {"document": data_document.to_mongo().to_dict(),
                    "recommendation_obj": matched_activity.ActiveRecommendation.to_mongo().to_dict(), "Status": True}
        else:
            knowledge_level = process_knowledge_level(matched_activity)
            if(matched_activity.RecommendationsViewed == 3):
                data_document = matched_activity.RecommendationsAccessed[0].Recommendation
                recommendation = save_recommendation_to_db(search_term, data_document, knowledge_level)
                matched_activity.FakeRecommendation = recommendation
            else:
                recommendation = save_recommendation_to_db(search_term, data_document, knowledge_level)
            matched_activity.ActiveRecommendation = recommendation
            matched_activity.RecommendationsMade =  matched_activity.RecommendationsMade+1
            user_document.RecommendationsFeed.append(recommendation)
            user_document.save()
            print("-------------------New Recommendation-------------------")
            return {"document": data_document.to_mongo().to_dict(),
                    "recommendation_obj": recommendation.to_mongo().to_dict(), "Status": True}
    else:
        return {"Status": False}


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


def save_new_user_to_db(username, search_term, recommendation, level, data_document):
    activity = UserActivity(
        Topic=data_document.Topic,
        SearchTerms=[search_term],
        Level=level,
        ActiveRecommendation=recommendation,
        RecommendationsMade=1,
        RecommendationsViewed=0,
        RecommendationsAccessed = []
    )
    user = User.objects(UserName=username).first()
    user.RecommendationsFeed.append(recommendation)
    user.Activity.append(activity)
    user.save()


def save_recommendation_to_db(search_term, data_document, knowledge_level):
    est_offset = timedelta(hours=-4)
    recommendation = Recommendations(
        SearchTerm=search_term, Recommendation=data_document, PredictedKnowledge=knowledge_level, TimeStamp=datetime.now(timezone(est_offset)))
    recommendation.UserAgreement["accessed"] = "no"
    # recommendation.save()
    return recommendation.save()


def process_knowledge_level(activity):

    unique_levels = set()
    total_pages = ResultsModels.DataDocument.objects(
        Topic=activity.Topic).count()
    for page in activity.PagesAccessed:
        unique_levels.add(page.Category_A)
    print("------------------------", unique_levels,
          "-----------------------------------")
    pages = len(unique_levels)
    print("No of unique pages accessed in this topic is ", pages)

    return pages



def fetch_results(search_term):
    search_word_array = search_term.lower().split()  # Convert search terms to array
    print(search_word_array)

    query = {'$and': [{'Keywords.' + key: {'$exists': True}} for key in search_word_array],
             'Category_A': 'Level 1',
             'Category_B': 1}

    result = ResultsModels.DataDocument.objects(__raw__=query).first()
    return result
