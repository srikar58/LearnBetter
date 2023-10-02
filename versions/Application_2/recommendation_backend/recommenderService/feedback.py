from django.apps import AppConfig
from .models import Recommendations


def UpdateFeedback(user_name, recommendation, rating_feedback, updated_rating):

    try:
        recommendation_obj = Recommendations.objects(
            id=recommendation["_id"]['$oid']).first()
        print(rating_feedback)
        if rating_feedback != "yes":
            print("This is running")
            recommendation_obj.UpdatedKnowledge = updated_rating
        feedback = {
            'rating_feedback': rating_feedback
        }
        recommendation_obj.UserAgreement = feedback
        print(recommendation_obj.id)
        rec = recommendation_obj.save()
        print(rec)
        return {"Status": "Success"}
    except:
        return {"Status": "Failed"}

def UpdateRecommendationFeedback(user_name, recommendation, recommendation_feedback, willing_feedback):

    try:
        recommendation_obj = Recommendations.objects(
            id=recommendation["_id"]['$oid']).first()
        print(recommendation_feedback)

        print("recommendation_feedback:------", recommendation_feedback)
        recommendation_obj.UserAgreement["recommendation_feedback"] = recommendation_feedback
        recommendation_obj.UserAgreement["next_recommendation_willingness_feedback"] = willing_feedback
        recommendation_obj.UserAgreement["accessed"] = "yes"

        print(recommendation_obj.id)

        rec = recommendation_obj.save()

        print(rec)
        return {"Status": "Success"}
    except:
        return {"Status": "Failed"}
    
def UpdateRecommendationViewFeedback(user_name, recommendation, recommendation_feedback):

    try:
        recommendation_obj = Recommendations.objects(
            id=recommendation["_id"]['$oid']).first()
        print(recommendation_feedback)

        print("recommendation_feedback:------", recommendation_feedback)
        recommendation_obj.UserAgreement["recommendation_view_feedback"] = recommendation_feedback

        print(recommendation_obj.id)

        rec = recommendation_obj.save()

        print(rec)
        return {"Status": "Success"}
    except:
        return {"Status": "Failed"}