"""
URL configuration for recommendation project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from testDb import views
import fetchResults.views
urlpatterns = [
    path('admin/', admin.site.urls),
    path('test-mongoengine/', views.test_mongoengine_connection,
         name='test_mongoengine'),
    path('filter_results/', fetchResults.views.filter_results_api,
         name='filter_results'),
    path('get_page/', fetchResults.views.fetch_result_api, name='fetch_a_page'),
]
