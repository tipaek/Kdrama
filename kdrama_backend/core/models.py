from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Kdrama(models.Model):
    title = models.CharField(max_length=200)
    rotten_tomatoes_score = models.FloatField()
    views = models.IntegerField()

class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    kdrama = models.ForeignKey(Kdrama, on_delete=models.CASCADE)

class Playlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    kdramas = models.ManyToManyField(Kdrama)