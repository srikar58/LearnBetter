from django.db import models
from mongoengine import Document, StringField, IntField

class Person(Document):
    first_name = StringField(max_length=50)
    last_name = StringField(max_length=50)
    age = IntField()

# Create your models here.
