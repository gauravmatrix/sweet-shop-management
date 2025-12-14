from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _

class CustomUser(AbstractUser):
    """
    Custom User model extending Django's AbstractUser.
    Adds email as unique identifier and admin flag.
    """
    
    # Make email unique and required
    email = models.EmailField(
        _('email address'),
        unique=True,
        help_text=_('Required. Enter a valid email address.')
    )
    
    # Admin flag for role-based permissions
    is_admin = models.BooleanField(
        _('admin status'),
        default=False,
        help_text=_('Designates whether the user can access admin features.')
    )
    
    # Override groups to avoid clash with AbstractUser
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name=_('groups'),
        blank=True,
        help_text=_(
            'The groups this user belongs to. A user will get all permissions '
            'granted to each of their groups.'
        ),
        related_name='customuser_set',  # Changed from default
        related_query_name='customuser',
    )
    
    # Override user_permissions to avoid clash
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name=_('user permissions'),
        blank=True,
        help_text=_('Specific permissions for this user.'),
        related_name='customuser_set',  # Changed from default
        related_query_name='customuser',
    )
    
    # Add any additional fields here if needed
    phone_number = models.CharField(
        _('phone number'),
        max_length=15,
        blank=True,
        null=True,
        help_text=_('Optional phone number for contact.')
    )
    
    profile_picture = models.ImageField(
        _('profile picture'),
        upload_to='profile_pics/',
        blank=True,
        null=True,
        help_text=_('Optional profile picture.')
    )
    
    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')
        ordering = ['-date_joined']
    
    def __str__(self):
        """String representation of the user."""
        return f"{self.email} ({self.username})"
    
    def get_full_name(self):
        """Return the full name of the user."""
        full_name = f"{self.first_name} {self.last_name}".strip()
        return full_name if full_name else self.username
    
    def is_staff_or_admin(self):
        """Check if user is staff or admin."""
        return self.is_staff or self.is_admin
    
    def save(self, *args, **kwargs):
        """Override save to ensure email is lowercase."""
        if self.email:
            self.email = self.email.lower()
        super().save(*args, **kwargs)
    
    # Ensure email field is used for authentication
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    def clean(self):
        """Custom validation."""
        from django.core.exceptions import ValidationError
        
        # Ensure email is provided
        if not self.email:
            raise ValidationError({'email': 'Email is required.'})
        
        # Ensure email is unique (handled by unique constraint, but explicit check)
        if CustomUser.objects.filter(email=self.email).exclude(pk=self.pk).exists():
            raise ValidationError({'email': 'A user with this email already exists.'})