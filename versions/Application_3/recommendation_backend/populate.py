import mongoengine
import pandas as pd
from collections import defaultdict
import sys

# Define your MongoDB connection settings
MONGO_DB_NAME = 'recommendation_app_3'
MONGO_DB_HOST = 'localhost'
MONGO_DB_PORT = 27017  # Default MongoDB port

# Connect to MongoDB using MongoEngine
mongoengine.connect(
    db=MONGO_DB_NAME,
    host=MONGO_DB_HOST,
    port=MONGO_DB_PORT,
)

# Define your MongoDB Document using MongoEngine
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

# Path to your ODS file
ods_file_path = sys.argv[1]

# Read data from the ODS file using pandas
data_df = pd.read_excel(ods_file_path)

# Loop through each row and create a MongoDB document
for index, row in data_df.iterrows():
    # keywords = []
    # keywords.extend(row['Topic'].split())
    # keywords.extend(row['Sub-topic'].split())
    # keywords.extend(row['Summary'].split())

    keyword_counts = defaultdict(int)
    keywords = row['Topic'].split() + row['Sub-topic'].split() + row['Summary'].split()
    
    for keyword in keywords:
        keyword_counts[keyword.lower()] += 1

    document = DataDocument(
        ID=row['ID'],
        Topic=row['Topic'],
        SubTopic=row['Sub-topic'],
        Link=row['Link'],
        Category_A=row['Category_A'],
        Category_B=int(row['Category_B']),
        Summary=row['Summary'],
        Content=row['Content'],
        Keywords=dict(keyword_counts)
    )
    try:
        document.save()
    except mongoengine.ValidationError as e:
        print(f"Validation error: {e}")

print("Data saved to MongoDB.")
