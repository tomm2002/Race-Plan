from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static
from .views import GPSFileUploadView, GPSFileListView


urlpatterns = [
    path("notes/", views.NoteListCreate.as_view(), name="note-list"),
    path("notes/delete/<int:pk>/", views.NoteDelete.as_view(), name="delete-note"),
    path("upload/gps/", views.GPSFileUploadView.as_view(), name="upload-gps"),
    path("gps/files/", GPSFileListView.as_view(), name="gps-file-list"),  # Add this line
] 


