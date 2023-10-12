import mongoengine
import pandas as pd
from collections import defaultdict
import sys
from models import DataDocument, Recommendations, UserActivity,User
import csv
# Define your MongoDB connection settings
MONGO_DB_NAME = sys.argv[1]
MONGO_DB_HOST = 'localhost'
MONGO_DB_PORT = 27017  # Default MongoDB port

# Connect to MongoDB using MongoEngine
mongoengine.connect(
    db=MONGO_DB_NAME,
    host=MONGO_DB_HOST,
    port=MONGO_DB_PORT,
)


# Function to extract UserAgreement values or use defaults
def extract_user_agreement(agreement):
    if agreement:
        return agreement.get('recommendation_view_feedback', -1), agreement.get('next_recommendation_willingness_feedback', -1), agreement.get('recommendation_feedback', -1)
    return -1, -1, -1

def exract_recommendations(recommendation_made,topic):
    recommendations_dict=dict()
    for recommendation in recommendation_made:
        if recommendation.Recommendation.Topic == topic:
            recommendations_dict[recommendation.Recommendation]=recommendation
    return recommendations_dict
# Extract and organize data
data_rows = []

users = User.objects.all()
result_rows = defaultdict()
for user in users:
    for activity in user.Activity:
        recommendations_dict=exract_recommendations(user.RecommendationsFeed,activity.Topic)
        searchterms=",".join(activity.SearchTerms)
        result_key=(user.UserName,searchterms)
        result_rows[result_key]=[]
        for page in activity.PagesAccessed:
            is_recommendation = page in recommendations_dict.keys()
            page_info = f"{page.Topic}-{page.Category_A}-{page.Category_B}"
            # user_agreement = extract_user_agreement(page.UserAgreement)
            
            recommendation_agreement = (-1, -1, -1)
            if is_recommendation:
                recommendation_agreement = extract_user_agreement(recommendations_dict[page].UserAgreement)
                del recommendations_dict[page]
            
            row = [
                # user.UserName,
                # activity.SearchTerms,
                page_info,
                "Yes" if is_recommendation else "No",
                # user_agreement,
                recommendation_agreement[0],
                recommendation_agreement[1],
                recommendation_agreement[2]
            ]
    
            result_rows[result_key].append(row)

        for page,recommendation in recommendations_dict.items():
            page_info = f"{page.Topic}-{page.Category_A}-{page.Category_B}"
            recommendation_agreement = extract_user_agreement(recommendation.UserAgreement)
            row = [
                # user.UserName,
                # activity.SearchTerms,
                page_info,
                "Yes" if is_recommendation else "No",
                # user_agreement,
                recommendation_agreement[0],
                recommendation_agreement[1],
                recommendation_agreement[2]
            ]
            result_rows[result_key].append(row)

        
            
# Print or use the organized data
for row in result_rows.keys():
    print("----------",row,"-----------")
    print(result_rows[row])

csv_filename = sys.argv[2]+'.csv'
with open(csv_filename, mode='w', newline='') as csv_file:
    writer = csv.writer(csv_file)
    for key, rows in result_rows.items():
        row_writer=[]
        row_writer += list(key)

        for row in rows:
            row_writer += row
        writer.writerow(row_writer)

# Close the database connection
mongoengine.disconnect()
