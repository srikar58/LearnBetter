from .models import Recommendations, User, UserActivity
from fetchResults import models as ResultsModels
import mongoengine


def process_activity(user_name, search_term, page_accessed):
    search_term = search_term.lower()
    search_word_array = search_term.lower().split()  # Convert search terms to array
    page_document = ResultsModels.DataDocument.objects.get(ID=page_accessed)
    try:
        existing_user_document = User.objects.get(UserName=user_name)
    except User.DoesNotExist:
        existing_user_document = User(UserName=user_name)
        # existing_user_document.save()

    # existing_user_document = User.objects.get(UserName=user_name)
    existing_activity = None
    for activity in existing_user_document.Activity:
        if activity.Topic == page_document.Topic:
            existing_activity = activity
            break

    if not existing_activity:
        existing_activity = UserActivity(Topic=page_document.Topic)
        existing_user_document.Activity.append(existing_activity)

    # print(type(search_term))
    if search_term not in existing_activity.SearchTerms:
        existing_activity.SearchTerms.append(search_term)

    existing_activity.PagesAccessed.append(page_document)

    print(existing_activity.Topic)
    current_level = page_document.Category_A + \
        "_" + str(page_document.Category_B)
    current_level_val = level_calc(
        page_document.Category_A, page_document.Category_B)

    if existing_activity.Level is not None:
        existing_level_val = level_calc(existing_activity.Level.split(
            "_")[0], int(existing_activity.Level.split("_")[1]))

    if existing_activity.Level is None or current_level_val > existing_level_val:
        existing_activity.Level = current_level

    if existing_activity.ActiveRecommendation.Recommendation == page_document:
        existing_activity.RecommendationsViewed =  existing_activity.RecommendationsViewed+1
         # recommendation = Recommendations.objects.get(existing_activity.ActiveRecommendation)
        print("Recommendation ------------------ ", existing_activity.ActiveRecommendation.SearchTerm)
        existing_activity.RecommendationsAccessed.append(existing_activity.ActiveRecommendation)

    try:
        id = existing_user_document.save()
    except mongoengine.ValidationError as e:
        print(f"Validation error: {e}")
    return {"activity working": "yes"}


def level_calc(Category_A, Category_B):
    if (Category_A == "Basic"):
        level1 = 0
    else:
        level1 = int(Category_A.split(" ")[1])

    level2 = Category_B

    total_level = (level1*10000)+level2
    return total_level
