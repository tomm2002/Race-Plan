from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, NoteSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Note
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status  

class GPSFileUploadView(APIView):
    def post(self, request):
        if 'gpsFile' not in request.FILES:
            return Response({'message': 'No file provided.'}, status=status.HTTP_400_BAD_REQUEST)

        gps_file = request.FILES.getlist('gpsFile')  

        if not gps_file:
            return Response({'message': 'No GPS file uploaded.'}, status=status.HTTP_400_BAD_REQUEST)

        gps_file = gps_file[0]

        print(f"Received file: {gps_file.name}")  
        return Response({'message': 'File uploaded successfully!'}, status=status.HTTP_201_CREATED)

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