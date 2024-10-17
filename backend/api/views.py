from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, NoteSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Note
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status  
from .models import GPSFile

class GPSFileUploadView(APIView):
    def post(self, request):
        if 'gpsFile' not in request.FILES:
            return Response({'message': 'No file provided.'}, status=status.HTTP_400_BAD_REQUEST)

        gps_file = request.FILES['gpsFile']

        gps_file_instance = GPSFile(file=gps_file)
        gps_file_instance.save()

        return Response({
            'message': 'File uploaded successfully!',
            'file_name': gps_file_instance.file.name,  # File name to display
            'file_url': gps_file_instance.file.url,    # URL to access the uploaded file
            'uploaded_at': gps_file_instance.uploaded_at
        }, status=status.HTTP_201_CREATED)

from .models import GPSFile  # Import the GPSFile model

class GPSFileListView(APIView):
    def get(self, request):
        gps_files = GPSFile.objects.all()
        file_list = []

        for gps_file in gps_files:
            file_list.append({
                'file_name': gps_file.file.name,
                'file_url': gps_file.file.url,  # URL to access the uploaded file
                'uploaded_at': gps_file.uploaded_at,
            })

        return Response(file_list, status=status.HTTP_200_OK)

class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            try:
                print("Received data:", serializer.validated_data)
                note = serializer.save(author=self.request.user)
                print("Note created successfully:", note)
            except Exception as e:
                print("Error saving note:", str(e))
        else:
            print("Serializer is not valid:", serializer.errors)


class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]