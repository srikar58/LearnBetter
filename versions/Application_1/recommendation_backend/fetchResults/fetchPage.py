from .models import DataDocument


def fetchPage(Username, pageID):
    document = DataDocument.objects(ID=pageID).get()
    return document.to_mongo().to_dict()
