from django.urls import path
from .views import PatientListView, PatientDetailView

urlpatterns = [
    path('patients/', PatientListView.as_view(), name='patient_list'),
    path('patients/<int:id>/', PatientDetailView.as_view(), name='patient_detail'),
]
