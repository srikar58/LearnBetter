from .models import DataDocument,User, UserActivity
from datetime import datetime, timedelta, timezone
import mongoengine

def fetchPage(Username, pageID):
    try:
        user = User.objects(Username=Username).first()
        if user is None:
        # User doesn't exist, create a new user
            user = User(Username=Username)
            user.save()
            print("New user registered")
    except Exception as e:
        # Handle exceptions properly (e.g., logging or specific exception types)
        print(f"Error while fetching or creating user: {e}")


    try:
        document = DataDocument.objects(ID=pageID).get()
        est_offset = timedelta(hours=-4)
        new_activity = UserActivity(Page=document, TimeStamp=datetime.now(timezone(est_offset)))
        
        if user.Activity is not None:
            for activity in user.Activity:
                time_difference = total_seconds(new_activity.TimeStamp) - total_seconds(activity.TimeStamp)
                print("Time difference------",time_difference)
                if(activity.Page == new_activity.Page and time_difference <= 2):
                    print("Duplicate Request, similar activity already exists for the user within 2 seconds.")
                    break
            user.Activity.append(new_activity)
        else:
            user.Activity = [new_activity]
        
        # Save the user object after updating activity
        user.save()
    except mongoengine.ValidationError as e:
        # Handle validation errors
        print(f"Validation error: {e}")
    except Exception as e:
        # Handle other exceptions (e.g., Document.DoesNotExist)
        print(f"Error while fetching or creating activity: {e}")
        
    return document.to_mongo().to_dict()

def total_seconds(timestamp):
    est_offset = timedelta(hours=-4)
    timestamp = timestamp.replace(tzinfo=timezone(est_offset))
    return (timestamp - datetime(1970, 1, 1, tzinfo=timezone(est_offset))).total_seconds()