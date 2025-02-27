"""
URL configuration for kdrama_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.urls import path
from core.views import SignupView, KdramaListView, home_page


urlpatterns = [
    path('', home_page, name='home'),
    path('admin/', admin.site.urls),
    # User authentication endpoints
    path('api/auth/signup/', SignupView.as_view(), name='signup'),
    # Simple jwt only handles token issuance, so we have to make custom signup endpoint
    path('api/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/kdramas/', KdramaListView.as_view(), name='kdrama_list')

]
