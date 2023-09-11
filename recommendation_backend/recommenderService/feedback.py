from django.apps import AppConfig
from .models import Recommendations


def UpdateFeedback(user_name, recommendation, recommendation_feedback, rating_feedback, updated_rating):

    try:
        recommendation_obj = Recommendations.objects(
            id=recommendation["_id"]['$oid']).first()
        print(rating_feedback)
        if rating_feedback != "yes":
            print("sthis is running")
            recommendation_obj.UpdatedKnowledge = updated_rating
        feedback = {
            'recommendation_feedback': recommendation_feedback,
            'rating_feedback': rating_feedback
        }
        recommendation_obj.UserAgreement = feedback
        print(recommendation_obj.id)
        rec = recommendation_obj.save()
        print(rec)
        return {"Status": "Success"}
    except:
        return {"Status": "Failed"}
