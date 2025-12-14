from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.validators import UniqueValidator
from django.core.exceptions import ValidationError as DjangoValidationError

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for User model.
    Handles user registration and profile display.
    """
    
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(
            queryset=User.objects.all(),
            message="A user with this email already exists."
        )]
    )
    
    username = serializers.CharField(
        required=True,
        min_length=3,
        max_length=30,
        validators=[UniqueValidator(
            queryset=User.objects.all(),
            message="Username already taken."
        )],
        help_text="Required. 3-30 characters. Letters, digits and @/./+/-/_ only."
    )
    
    password = serializers.CharField(
        write_only=True,
        required=True,
        min_length=8,
        max_length=128,
        style={'input_type': 'password'},
        help_text="Required. Minimum 8 characters."
    )
    
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        help_text="Enter the same password as above for verification."
    )
    
    is_admin = serializers.BooleanField(
        required=False,
        default=False,
        help_text="Designates whether this user has admin privileges."
    )
    
    class Meta:
        model = User
        fields = (
            'id', 'email', 'username', 'password', 'password_confirm',
            'first_name', 'last_name', 'is_admin', 'is_active',
            'date_joined', 'last_login'
        )
        read_only_fields = (
            'id', 'is_active', 'date_joined', 'last_login'
        )
        extra_kwargs = {
            'first_name': {'required': False, 'allow_blank': True},
            'last_name': {'required': False, 'allow_blank': True},
        }
    
    def validate_email(self, value):
        """Validate email format and uniqueness."""
        value = value.lower().strip()
        
        # Check if email is already in use
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already registered.")
        
        return value
    
    def validate_username(self, value):
        """Validate username."""
        value = value.strip()
        
        # Check for allowed characters
        import re
        if not re.match(r'^[\w.@+-]+\Z', value):
            raise serializers.ValidationError(
                "Username can only contain letters, digits and @/./+/-/_ characters."
            )
        
        return value
    
    def validate_password(self, value):
        """Validate password strength."""
        try:
            validate_password(value)
        except DjangoValidationError as e:
            raise serializers.ValidationError(list(e.messages))
        
        return value
    
    def validate(self, data):
        """Validate the entire data."""
        # Check password confirmation
        if data.get('password') != data.get('password_confirm'):
            raise serializers.ValidationError({
                'password_confirm': "Passwords do not match."
            })
        
        # Remove password_confirm from validated data
        data.pop('password_confirm', None)
        
        return data
    
    def create(self, validated_data):
        """Create a new user with encrypted password."""
        # Extract password and remove from validated_data
        password = validated_data.pop('password')
        
        # Create user
        user = User.objects.create(**validated_data)
        
        # Set password properly
        user.set_password(password)
        user.save()
        
        return user
    
    def update(self, instance, validated_data):
        """Update user instance."""
        # Handle password update if provided
        password = validated_data.pop('password', None)
        
        # Update other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # Update password if provided
        if password:
            instance.set_password(password)
        
        instance.save()
        return instance
    
    def to_representation(self, instance):
        """Customize the response data."""
        data = super().to_representation(instance)
        
        # Remove sensitive fields
        data.pop('password', None)
        data.pop('password_confirm', None)
        
        # Add full name field
        data['full_name'] = instance.get_full_name()
        
        # Add role information
        data['role'] = 'admin' if instance.is_admin else 'user'
        data['is_staff_or_admin'] = instance.is_staff_or_admin()
        
        return data


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for user profile (read-only).
    """
    full_name = serializers.SerializerMethodField()
    role = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = (
            'id', 'email', 'username', 'first_name', 'last_name',
            'full_name', 'role', 'is_admin', 'is_active',
            'date_joined', 'last_login', 'phone_number'
        )
        read_only_fields = fields
    
    def get_full_name(self, obj):
        return obj.get_full_name()
    
    def get_role(self, obj):
        if obj.is_superuser:
            return 'superadmin'
        elif obj.is_admin:
            return 'admin'
        elif obj.is_staff:
            return 'staff'
        else:
            return 'user'


class ChangePasswordSerializer(serializers.Serializer):
    """
    Serializer for password change.
    """
    old_password = serializers.CharField(
        required=True,
        write_only=True,
        style={'input_type': 'password'}
    )
    
    new_password = serializers.CharField(
        required=True,
        write_only=True,
        min_length=8,
        style={'input_type': 'password'},
        validators=[validate_password]
    )
    
    new_password_confirm = serializers.CharField(
        required=True,
        write_only=True,
        style={'input_type': 'password'}
    )
    
    def validate(self, data):
        """Validate password change."""
        # Check if new passwords match
        if data['new_password'] != data['new_password_confirm']:
            raise serializers.ValidationError({
                'new_password_confirm': "New passwords do not match."
            })
        
        # Check if old and new passwords are same
        if data['old_password'] == data['new_password']:
            raise serializers.ValidationError({
                'new_password': "New password must be different from old password."
            })
        
        return data


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom JWT token serializer that uses email instead of username.
    """
    username_field = 'email'
    
    def validate(self, attrs):
        """Validate credentials and return tokens."""
        data = super().validate(attrs)
        
        # Add custom claims to the response
        data.update({
            'id': self.user.id,
            'email': self.user.email,
            'username': self.user.username,
            'is_admin': self.user.is_admin,
            'is_staff': self.user.is_staff,
            'is_active': self.user.is_active,
            'first_name': self.user.first_name or '',
            'last_name': self.user.last_name or '',
        })
        
        return data
    
    @classmethod
    def get_token(cls, user):
        """Add custom claims to the JWT token."""
        token = super().get_token(user)
        
        # Custom claims
        token['email'] = user.email
        token['username'] = user.username
        token['is_admin'] = user.is_admin
        token['is_staff'] = user.is_staff
        
        return token


class UserUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating user profile (excluding password).
    """
    email = serializers.EmailField(required=False)
    username = serializers.CharField(required=False, min_length=3, max_length=30)
    
    class Meta:
        model = User
        fields = ('email', 'username', 'first_name', 'last_name', 'phone_number')
    
    def validate_email(self, value):
        """Validate email update."""
        if value:
            value = value.lower().strip()
            
            # Check if email is already in use by another user
            user = self.context['request'].user
            if User.objects.filter(email=value).exclude(pk=user.pk).exists():
                raise serializers.ValidationError("This email is already registered.")
        
        return value
    
    def validate_username(self, value):
        """Validate username update."""
        if value:
            value = value.strip()
            
            # Check if username is already in use by another user
            user = self.context['request'].user
            if User.objects.filter(username=value).exclude(pk=user.pk).exists():
                raise serializers.ValidationError("Username already taken.")
        
        return value