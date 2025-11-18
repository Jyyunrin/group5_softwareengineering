# fango/urls.py (project-level)
from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),

    # include their URLs under an API prefix
    path('api/', include('fango.api_urls')),  
]