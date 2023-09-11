from django.shortcuts import render
from .models import Person

def test_mongoengine_connection(request):
    # Creating a new Person document using the MongoEngine model
    person = Person(
        first_name='Sohn',
        last_name='Doe',
        age=10
    )
    person.save()  # Save the document to the database

    # Query all Person documents from the database
    people = Person.objects.all()

    return render(request, 'test_mongoengine_connection.html', {'people': people})
