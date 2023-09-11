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