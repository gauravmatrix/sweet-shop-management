from django.contrib.sitemaps import Sitemap
from django.urls import reverse
from .models import Sweet

class SweetSitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.8
    
    def items(self):
        return Sweet.objects.filter(quantity__gt=0)
    
    def lastmod(self, obj):
        return obj.updated_at
    
    def location(self, obj):
        return reverse('sweet-detail', kwargs={'pk': obj.pk})