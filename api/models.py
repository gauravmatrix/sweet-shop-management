from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone

class Sweet(models.Model):
    """
    Model representing a sweet item in the shop.
    """
    
    # Category choices
    class Category(models.TextChoices):
        CHOCOLATE = 'chocolate', _('Chocolate')
        CANDY = 'candy', _('Candy')
        CAKE = 'cake', _('Cake')
        COOKIE = 'cookie', _('Cookie')
        DESSERT = 'dessert', _('Dessert')
        INDIAN = 'indian', _('Indian Sweet')
        BAKERY = 'bakery', _('Bakery Item')
        OTHER = 'other', _('Other')
    
    # Basic information
    name = models.CharField(
        _('sweet name'),
        max_length=200,
        help_text=_('Enter the name of the sweet (max 200 characters).')
    )
    
    description = models.TextField(
        _('description'),
        blank=True,
        help_text=_('Optional description of the sweet.')
    )
    
    category = models.CharField(
        _('category'),
        max_length=50,
        choices=Category.choices,
        default=Category.OTHER,
        help_text=_('Select the category of the sweet.')
    )
    
    # Pricing
    price = models.DecimalField(
        _('price'),
        max_digits=10,  # Up to 9999999.99
        decimal_places=2,
        validators=[MinValueValidator(0.01)],  # Price must be > 0
        help_text=_('Price per unit in INR.')
    )
    
    # Inventory
    quantity = models.IntegerField(
        _('quantity in stock'),
        default=0,
        validators=[MinValueValidator(0)],  # Cannot be negative
        help_text=_('Number of units available in stock.')
    )
    
    # Image (optional)
    image = models.ImageField(
        _('sweet image'),
        upload_to='sweet_images/',
        blank=True,
        null=True,
        help_text=_('Optional image of the sweet.')
    )
    
    # Nutritional info (optional)
    calories = models.PositiveIntegerField(
        _('calories'),
        blank=True,
        null=True,
        help_text=_('Calories per serving (optional).')
    )
    
    is_featured = models.BooleanField(
        _('featured item'),
        default=False,
        help_text=_('Check to feature this sweet on the homepage.')
    )
    
    # Timestamps
    created_at = models.DateTimeField(
        _('created at'),
        auto_now_add=True,
        editable=False
    )
    
    updated_at = models.DateTimeField(
        _('updated at'),
        auto_now=True,
        editable=False
    )
    
    class Meta:
        verbose_name = _('sweet')
        verbose_name_plural = _('sweets')
        ordering = ['-created_at', 'name']
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['category']),
            models.Index(fields=['price']),
            models.Index(fields=['created_at']),
        ]
        # Django 5.0 compatible constraints
        constraints = [
            models.CheckConstraint(
                condition=models.Q(price__gt=0),  # CHANGED: check to condition
                name='price_positive'
            ),
            models.CheckConstraint(
                condition=models.Q(quantity__gte=0),  # CHANGED: check to condition
                name='quantity_non_negative'
            ),
        ]
    
    def __str__(self):
        """String representation of the sweet."""
        return f"{self.name} ({self.get_category_display()})"
    
    # Property methods for easy access
    @property
    def is_available(self):
        """Check if the sweet is available (quantity > 0)."""
        return self.quantity > 0
    
    @property
    def stock_status(self):
        """Get stock status as text."""
        if self.quantity == 0:
            return _('Out of Stock')
        elif self.quantity <= 10:
            return _('Low Stock')
        else:
            return _('In Stock')
    
    @property
    def total_value(self):
        """Calculate total inventory value."""
        return self.price * self.quantity
    
    @property
    def days_since_created(self):
        """Calculate days since creation."""
        return (timezone.now() - self.created_at).days
    
    # Business logic methods
    def purchase(self, quantity):
        """
        Purchase specified quantity of sweet.
        Returns: (success, message)
        """
        if quantity <= 0:
            return False, _('Quantity must be positive.')
        
        if quantity > self.quantity:
            return False, _('Insufficient stock available.')
        
        self.quantity -= quantity
        self.save()
        return True, _('Purchase successful.')
    
    def restock(self, quantity):
        """
        Restock specified quantity of sweet.
        Returns: (success, message)
        """
        if quantity <= 0:
            return False, _('Restock quantity must be positive.')
        
        self.quantity += quantity
        self.save()
        return True, _('Restock successful.')
    
    def update_price(self, new_price):
        """
        Update price of sweet.
        Returns: (success, message)
        """
        if new_price <= 0:
            return False, _('Price must be positive.')
        
        self.price = new_price
        self.save()
        return True, _('Price updated successfully.')
    
    # Display methods for admin
    def get_category_color(self):
        """Get color for category badge (for admin display)."""
        color_map = {
            'chocolate': '#7B3F00',
            'candy': '#FF4081',
            'cake': '#FF9800',
            'cookie': '#8D6E63',
            'dessert': '#2196F3',
            'indian': '#F44336',
            'bakery': '#795548',
            'other': '#9E9E9E',
        }
        return color_map.get(self.category, '#9E9E9E')
    
    def clean(self):
        """Custom validation."""
        from django.core.exceptions import ValidationError
        
        # Validate price
        if self.price <= 0:
            raise ValidationError({'price': 'Price must be greater than zero.'})
        
        # Validate quantity
        if self.quantity < 0:
            raise ValidationError({'quantity': 'Quantity cannot be negative.'})
        
        # Validate name uniqueness (case-insensitive within category)
        if Sweet.objects.filter(
            name__iexact=self.name,
            category=self.category
        ).exclude(pk=self.pk).exists():
            raise ValidationError(
                f'A sweet with name "{self.name}" already exists in {self.get_category_display()} category.'
            )
    
    def save(self, *args, **kwargs):
        """Override save to run validation and handle image."""
        self.full_clean()  # Run validation
        super().save(*args, **kwargs)