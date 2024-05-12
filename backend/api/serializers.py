


from rest_framework import serializers
from .models import Student, StudentDetails

class StudentDetailsSerializer(serializers.ModelSerializer):
    total_marks = serializers.IntegerField(read_only=True)
    class Meta:
        model = StudentDetails
        fields = ('id', 'year', 'mark1', 'mark2','student', 'mark3', 'total_marks') 
        
    def to_representation(self, instance):
        instance.total_marks = instance.mark1 + instance.mark2 + instance.mark3
        return super().to_representation(instance)
    
class StudentSerializer(serializers.ModelSerializer):
    # details = StudentDetailsSerializer(source='studentdetails_set', many=True, read_only=True)  # Nested serializer

    details = StudentDetailsSerializer(many=True, read_only=True)
    class Meta:
        model = Student
        fields = ('id','image' ,'student_id', 'name', 'phone', 'email', 'date_of_birth', 'address', 'township', 'NRC', 'details')
