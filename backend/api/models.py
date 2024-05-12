from django.db import models
import uuid

def upload_to(instance, filename):
    return 'images/{filename}'.format(filename=filename)

class Student(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    image = models.ImageField(upload_to=upload_to, blank=True, null=True)
    student_id = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    email = models.EmailField(unique=True)
    date_of_birth = models.DateField()
    address = models.TextField()
    township = models.CharField(max_length=255)
    NRC = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return self.name

class StudentDetails(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    year = models.CharField(max_length=4)  
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='details')
    mark1 = models.IntegerField()
    mark2 = models.IntegerField()
    mark3 = models.IntegerField()
    total_marks = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return f"{self.student.name} - {self.year}"
