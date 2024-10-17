from django.db import models
from django.contrib.auth.models import User


from django.db import models

class GPSFile(models.Model):
    file = models.FileField(upload_to='gps_files/') 
    uploaded_at = models.DateTimeField(auto_now_add=True)  

    def __str__(self):
        return self.file.name

class Note(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.title