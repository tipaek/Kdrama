from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from django.contrib.auth.models import User
from .serializers import UserSignupSerializer, KdramaSerializer
from .models import Kdrama

from django.http import JsonResponse
from .tmdb_api import get_kdramas

# this is the main endpoint, since lazy to db and just call api
# later, if want local stores, then call other api
def home_page(request):
    page = request.GET.get('page', 1)
    min_score = request.GET.get('min_score')
    max_score = request.GET.get('max_score')
    score = request.GET.get('score')
    
    # Call get_kdramas with the provided query parameters.
    kdramas = get_kdramas(page=page, min_score=min_score, max_score=max_score, score=score)
    return JsonResponse(kdramas)

# the view for getting a list of kdramas
# ListAPIView does api requests automatically
class KdramaListView(generics.ListAPIView):
    serializer_class = KdramaSerializer

    def get_queryset(self):
        queryset = Kdrama.objects.all()
        # if the query contains a 'min_score' parameter or smth, what we should query
        min_score = self.request.query_params.get('min_score')
        max_score = self.request.query_params.get('max_score')
        # Optional filtering by Rotten Tomatoes score using a query parameter.
        score = self.request.query_params.get('score')
        if score:
            try:
                queryset = queryset.filter(rotten_tomatoes_score=score)
            except ValueError: pass
        if min_score:
            try:
                queryset = queryset.filter(rotten_tomatoes_score__gte=float(min_score))
            except ValueError: pass
        if max_score:
            try:
                queryset = queryset.filter(rotten_tomatoes_score__lte=float(max_score))
            except ValueError: pass
        return queryset


# our signup endpoint page, which is just serializer and a createapiview thing
# this handles POST requests to create new users
class SignupView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSignupSerializer