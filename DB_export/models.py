from django.db import models
import mongoengine
# Create your models here.

class DataDocument(mongoengine.Document):
    ID = mongoengine.IntField()
    Topic = mongoengine.StringField()
    SubTopic = mongoengine.StringField()
    Link = mongoengine.StringField()
    Category_A = mongoengine.StringField()
    Category_B = mongoengine.IntField()
    Summary = mongoengine.StringField()
    Content = mongoengine.StringField()
    # Keywords = mongoengine.ListField(mongoengine.StringField())
    Keywords = mongoengine.DictField()

class Recommendations(mongoengine.Document):
    SearchTerm = mongoengine.StringField()
    Recommendation = mongoengine.ReferenceField(DataDocument)
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
        mongoengine.ReferenceField(DataDocument))
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
