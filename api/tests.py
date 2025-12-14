from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Sweet

User = get_user_model()

class SweetTests(APITestCase):
    def setUp(self):
        # Create admin user
        self.admin_user = User.objects.create_user(
            email='admin@test.com',
            username='admin',
            password='admin123',
            is_admin=True
        )
        
        # Create regular user
        self.regular_user = User.objects.create_user(
            email='user@test.com',
            username='user',
            password='user123',
            is_admin=False
        )
        
        # Create a sweet
        self.sweet = Sweet.objects.create(
            name='Chocolate Bar',
            category='chocolate',
            price=100.00,
            quantity=50
        )
        
        # Get tokens
        admin_resp = self.client.post(reverse('login'), {
            'email': 'admin@test.com',
            'password': 'admin123'
        })
        self.admin_token = admin_resp.data['access']
        
        user_resp = self.client.post(reverse('login'), {
            'email': 'user@test.com',
            'password': 'user123'
        })
        self.user_token = user_resp.data['access']
    
    def test_create_sweet_admin(self):
        """Test admin can create sweet"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}')
        data = {
            'name': 'New Sweet',
            'category': 'candy',
            'price': 50.00,
            'quantity': 100
        }
        response = self.client.post(reverse('sweet-list'), data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Sweet.objects.count(), 2)
    
    def test_create_sweet_non_admin(self):
        """Test non-admin cannot create sweet"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.user_token}')
        data = {
            'name': 'New Sweet',
            'category': 'candy',
            'price': 50.00,
            'quantity': 100
        }
        response = self.client.post(reverse('sweet-list'), data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_get_sweets(self):
        """Test anyone can view sweets"""
        response = self.client.get(reverse('sweet-list'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        # With auth
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.user_token}')
        response = self.client.get(reverse('sweet-list'))
        self.assertEqual(response.status_code, status.HTP_200_OK)
        self.assertEqual(len(response.data), 1)
    
    def test_purchase_sweet(self):
        """Test purchase functionality"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.user_token}')
        data = {'quantity': 5}
        response = self.client.post(
            reverse('purchase', kwargs={'pk': self.sweet.id}),
            data
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.sweet.refresh_from_db()
        self.assertEqual(self.sweet.quantity, 45)
    
    def test_search_sweets(self):
        """Test search functionality"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.user_token}')
        response = self.client.get(
            reverse('sweet-search') + '?name=chocolate&category=chocolate'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)