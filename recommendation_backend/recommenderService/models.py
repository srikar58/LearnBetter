from django.db import models
import mongoengine
from fetchResults import models as resultsModels
# Create your models here.


class Recommendations(mongoengine.Document):
    SearchTerm = mongoengine.StringField()
    Recommendation = mongoengine.ReferenceField(resultsModels.DataDocument)
    Feedback = mongoengine.IntField()
    TimeStamp = mongoengine.DateTimeField()


class UserActivity(mongoengine.EmbeddedDocument):
    Topic = mongoengine.StringField()
    SearchTerms = mongoengine.ListField(mongoengine.StringField())
    PagesAccessed = mongoengine.ListField(
        mongoengine.ReferenceField(resultsModels.DataDocument))
    Level = mongoengine.StringField()


class User(mongoengine.Document):
    UserName = mongoengine.StringField()
    Activity = mongoengine.EmbeddedDocumentListField(UserActivity)
    RecommendationsFeed = mongoengine.ListField(
        mongoengine.ReferenceField(Recommendations))
