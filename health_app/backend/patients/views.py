from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Patient
from .serializers import PatientSerializer
from .groq_service import get_health_prediction


class PatientListView(APIView):
    """
    GET  /api/patients/  - Return all patients
    POST /api/patients/  - Create a new patient with AI remarks
    """

    def get(self, request):
        patients = Patient.objects.all()
        serializer = PatientSerializer(patients, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = PatientSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            # Call Groq AI to generate health remarks
            remarks = get_health_prediction(
                full_name=data['full_name'],
                date_of_birth=data['date_of_birth'],
                glucose=data['glucose'],
                haemoglobin=data['haemoglobin'],
                cholesterol=data['cholesterol'],
            )
            patient = serializer.save(remarks=remarks)
            return Response(PatientSerializer(patient).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PatientDetailView(APIView):
    """
    GET    /api/patients/<id>/  - Return a single patient
    PUT    /api/patients/<id>/  - Update patient and regenerate AI remarks
    DELETE /api/patients/<id>/  - Delete a patient
    """

    def get_object(self, id):
        try:
            return Patient.objects.get(id=id)
        except Patient.DoesNotExist:
            return None

    def get(self, request, id):
        patient = self.get_object(id)
        if patient is None:
            return Response({'error': 'Patient not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = PatientSerializer(patient)
        return Response(serializer.data)

    def put(self, request, id):
        patient = self.get_object(id)
        if patient is None:
            return Response({'error': 'Patient not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = PatientSerializer(patient, data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            # Regenerate AI remarks on update
            remarks = get_health_prediction(
                full_name=data['full_name'],
                date_of_birth=data['date_of_birth'],
                glucose=data['glucose'],
                haemoglobin=data['haemoglobin'],
                cholesterol=data['cholesterol'],
            )
            patient = serializer.save(remarks=remarks)
            return Response(PatientSerializer(patient).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        patient = self.get_object(id)
        if patient is None:
            return Response({'error': 'Patient not found'}, status=status.HTTP_404_NOT_FOUND)
        patient.delete()
        return Response({'message': 'Patient deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
