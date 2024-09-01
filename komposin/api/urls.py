from django.urls import path
from . import views

version = "v1"

urlpatterns = [
    path(version +'/image_detection', views.image_detection, name='image_detection'),
    path(version +'/insert_db', views.insert_db, name='insert_db'),
    path(version +'/get_data_all', views.get_data_all, name='get_data_all'),
    path(version + '/get-csrf-token', views.get_csrf_token, name='get-csrf-token'),
    path(version + '/object_todo', views.object_todo, name='object_todo'),
    path(version + '/generate_recipe', views.generate_recipe, name='generate_recipe'),
    # path(version +'/object_todo', views.object_todo, name='object_todo'),
    # path(version +'/how_to', views.how_to, name='how_to'),
]
