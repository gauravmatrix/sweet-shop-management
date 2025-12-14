from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from api.models import Sweet

User = get_user_model()

class Command(BaseCommand):
    help = 'Create sample data for testing'
    
    def handle(self, *args, **kwargs):
        # Create admin user if not exists
        if not User.objects.filter(email='admin@example.com').exists():
            admin = User.objects.create_superuser(
                email='admin@example.com',
                username='admin',
                password='admin123',
                is_admin=True
            )
            self.stdout.write(self.style.SUCCESS('Admin user created'))
        
        # Create sample sweets if none exist
        if Sweet.objects.count() == 0:
            sample_sweets = [
                {
                    'name': 'Chocolate Truffle',
                    'description': 'Rich dark chocolate truffle',
                    'category': 'chocolate',
                    'price': 25.00,
                    'quantity': 100
                },
                {
                    'name': 'Gulab Jamun',
                    'description': 'Traditional Indian sweet in sugar syrup',
                    'category': 'indian',
                    'price': 15.00,
                    'quantity': 50
                },
                {
                    'name': 'Blueberry Cheesecake',
                    'description': 'Creamy cheesecake with blueberry topping',
                    'category': 'cake',
                    'price': 350.00,
                    'quantity': 10
                },
                {
                    'name': 'Gummy Bears',
                    'description': 'Assorted fruit flavored gummy bears',
                    'category': 'candy',
                    'price': 10.00,
                    'quantity': 200
                },
                {
                    'name': 'Chocolate Chip Cookies',
                    'description': 'Freshly baked cookies with chocolate chips',
                    'category': 'cookie',
                    'price': 20.00,
                    'quantity': 75
                },
                {
                    'name': 'Tiramisu',
                    'description': 'Italian coffee-flavored dessert',
                    'category': 'dessert',
                    'price': 280.00,
                    'quantity': 8
                },
                {
                    'name': 'Rasgulla',
                    'description': 'Soft cottage cheese balls in sugar syrup',
                    'category': 'indian',
                    'price': 12.00,
                    'quantity': 0  # Out of stock
                },
                {
                    'name': 'White Chocolate Bar',
                    'description': 'Creamy white chocolate bar',
                    'category': 'chocolate',
                    'price': 40.00,
                    'quantity': 30
                },
            ]
            
            for sweet_data in sample_sweets:
                Sweet.objects.create(**sweet_data)
            
            self.stdout.write(self.style.SUCCESS('Created 8 sample sweets'))
        
        self.stdout.write(self.style.SUCCESS('Sample data creation complete'))