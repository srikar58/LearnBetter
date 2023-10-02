from django.db import models
import mongoengine
from fetchResults import models as resultsModels
# Create your models here.


class Recommendations(mongoengine.Document):
    SearchTerm = mongoengine.StringField()
    Recommendation = mongoengine.ReferenceField(resultsModels.DataDocument)
    Feedback = mongoengine.IntField()
    PredictedKnowledge = mongoengine.IntField()
    UserAgreement = mongoengine.DictField()
    UpdatedKnowledge = mongoengine.IntField()
    TimeStamp = mongoengine.DateTimeField()
    RecommendationLevel = mongoengine.StringField


class UserActivity(mongoengine.EmbeddedDocument):
    Topic = mongoengine.StringField()
    SearchTerms = mongoengine.ListField(mongoengine.StringField())
    PagesAccessed = mongoengine.ListField(
        mongoengine.ReferenceField(resultsModels.DataDocument))
    Level = mongoengine.StringField()
    ActiveRecommendation = mongoengine.ReferenceField(Recommendations)
    RecommendationsMade = mongoengine.IntField()
    FakeRecommendations = mongoengine.ListField(mongoengine.ReferenceField(Recommendations))
    RecommendationsViewed = mongoengine.IntField()
    RecommendationsAccessed = mongoengine.ListField(mongoengine.ReferenceField(Recommendations))


class User(mongoengine.Document):
    UserName = mongoengine.StringField()
    Activity = mongoengine.EmbeddedDocumentListField(UserActivity)
    RecommendationsFeed = mongoengine.ListField(
        mongoengine.ReferenceField(Recommendations))
