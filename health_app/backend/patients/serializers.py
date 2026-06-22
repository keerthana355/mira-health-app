from rest_framework import serializers
from .models import Patient
from datetime import date

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_date_of_birth(self, value):
        if value > date.today():
            raise serializers.ValidationError("Date of birth cannot be a future date.")
        return value

    def validate_glucose(self, value):
        if value < 0:
            raise serializers.ValidationError("Glucose must be a positive number.")
        return value

    def validate_haemoglobin(self, value):
        if value < 0:
            raise serializers.ValidationError("Haemoglobin must be a positive number.")
        return value

    def validate_cholesterol(self, value):
        if value < 0:
            raise serializers.ValidationError("Cholesterol must be a positive number.")
        return value
