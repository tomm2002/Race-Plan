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
from django.conf import settings

import xml.etree.ElementTree as ET
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import GPSFile
from .serializers import GPSFileSerializer

class GPSFileUploadView(APIView):
    def post(self, request):
        serializer = GPSFileSerializer(data=request.data)
        if serializer.is_valid():
            gps_file = serializer.save()  # Save the file
            full_url = f"{request.build_absolute_uri(settings.MEDIA_URL)}{gps_file.file}"
            print("File uploaded successfully:", full_url)
            return Response({'message': 'File uploaded successfully', 'file_url': full_url, 'uploaded_at': gps_file.uploaded_at}, status=status.HTTP_201_CREATED)
        else:
            print("Serializer errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def extract_points(self, file_path):
        points = []
        try:
            tree = ET.parse(file_path)  # Load the GPX file
            root = tree.getroot()
            namespace = {'gpx': 'http://www.topografix.com/GPX/1/1'}

            for trkpt in root.findall('.//gpx:trkpt', namespace):
                lat = trkpt.get('lat')
                lon = trkpt.get('lon')
                ele = trkpt.find('gpx:ele', namespace).text if trkpt.find('gpx:ele', namespace) is not None else None
                points.append({'latitude': lat, 'longitude': lon, 'elevation': ele})
        except Exception as e:
            print(f"Error parsing GPX file: {e}")
        
        return points


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