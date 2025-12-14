from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()

class UserTests(APITestCase):
    def setUp(self):
        self.register_url = reverse('register')
        self.login_url = reverse('login')
        self.profile_url = reverse('profile')
        
    def test_user_registration(self):
        """Test user can register successfully"""
        data = {
            'email': 'test@example.com',
            'username': 'testuser',
            'password': 'testpass123',
            'is_admin': False
        }
        response = self.client.post(self.register_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().email, 'test@example.com')
    
    def test_user_login(self):
        """Test user can login and get JWT token"""
        # First create user
        user = User.objects.create_user(
            email='test@example.com',
            username='testuser',
            password='testpass123'
        )
        
        # Login
        data = {
            'email': 'test@example.com',
            'password': 'testpass123'
        }
        response = self.client.post(self.login_url, data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
    
    def test_user_profile_access(self):
        """Test authenticated user can access profile"""
        user = User.objects.create_user(
            email='test@example.com',
            username='testuser',
            password='testpass123'
        )
        
        # Login first
        login_data = {
            'email': 'test@example.com',
            'password': 'testpass123'
        }
        login_response = self.client.post(self.login_url, login_data)
        token = login_response.data['access']
        
        # Access profile with token
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        profile_response = self.client.get(self.profile_url)
        
        self.assertEqual(profile_response.status_code, status.HTTP_200_OK)
        self.assertEqual(profile_response.data['email'], 'test@example.com')
    
    def test_admin_user_creation(self):
        """Test admin user can be created"""
        data = {
            'email': 'admin@example.com',
            'username': 'admin',
            'password': 'adminpass123',
            'is_admin': True
        }
        response = self.client.post(self.register_url, data)
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        user = User.objects.get(email='admin@example.com')
        self.assertTrue(user.is_admin)
    
    def test_duplicate_email_registration(self):
        """Test duplicate email registration fails"""
        # Create first user
        User.objects.create_user(
            email='test@example.com',
            username='testuser1',
            password='testpass123'
        )
        
        # Try to create another user with same email
        data = {
            'email': 'test@example.com',
            'username': 'testuser2',
            'password': 'testpass123'
        }
        response = self.client.post(self.register_url, data)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)