from rest_framework import serializers
from django.core.validators import MinValueValidator, MaxValueValidator
from .models import Sweet
from decimal import Decimal, ROUND_HALF_UP


class SweetSerializer(serializers.ModelSerializer):
    """
    Serializer for Sweet model (full details).
    """
    # Read-only fields
    is_available = serializers.BooleanField(read_only=True)
    stock_status = serializers.CharField(read_only=True)
    total_value = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        read_only=True
    )
    days_since_created = serializers.IntegerField(read_only=True)
    
    # Category display field
    category_display = serializers.CharField(
        source='get_category_display',
        read_only=True
    )
    
    # Image handling
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Sweet
        fields = (
            'id', 'name', 'description', 'category', 'category_display',
            'price', 'quantity', 'is_available', 'stock_status',
            'total_value', 'image', 'image_url', 'calories',
            'is_featured', 'created_at', 'updated_at', 'days_since_created'
        )
        read_only_fields = ('id', 'created_at', 'updated_at')
        extra_kwargs = {
            'name': {
                'required': True,
                'max_length': 200,
                'help_text': 'Name of the sweet (max 200 characters).'
            },
            'description': {
                'required': False,
                'allow_blank': True,
                'help_text': 'Optional description of the sweet.'
            },
            'category': {
                'required': True,
                'help_text': 'Category of the sweet.'
            },
            'price': {
                'required': True,
                'help_text': 'Price per unit in INR. Must be greater than 0.'
            },
            'quantity': {
                'required': True,
                'help_text': 'Quantity in stock. Cannot be negative.'
            },
            'image': {
                'required': False,
                'help_text': 'Optional image of the sweet.'
            },
            'calories': {
                'required': False,
                'allow_null': True,
                'help_text': 'Calories per serving (optional).'
            },
            'is_featured': {
                'required': False,
                'default': False,
                'help_text': 'Feature this sweet on homepage.'
            }
        }
    
    def get_image_url(self, obj):
        """Get absolute image URL if image exists."""
        if obj.image and hasattr(obj.image, 'url'):
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None
    
    def validate_name(self, value):
        """Validate sweet name."""
        value = value.strip()
        if len(value) < 2:
            raise serializers.ValidationError(
                "Name must be at least 2 characters long."
            )
        return value
    
    def validate_price(self, value):
        """Validate price."""
        if value <= 0:
            raise serializers.ValidationError(
                "Price must be greater than zero."
            )
        
        # Round to 2 decimal places
        return Decimal(value).quantize(
            Decimal('0.01'),
            rounding=ROUND_HALF_UP
        )
    
    def validate_quantity(self, value):
        """Validate quantity."""
        if value < 0:
            raise serializers.ValidationError(
                "Quantity cannot be negative."
            )
        
        # Warn if quantity is too high (optional)
        if value > 10000:
            raise serializers.ValidationError(
                "Quantity seems unusually high. Please verify."
            )
        
        return value
    
    def validate_calories(self, value):
        """Validate calories."""
        if value is not None:
            if value <= 0:
                raise serializers.ValidationError(
                    "Calories must be positive if provided."
                )
            if value > 10000:
                raise serializers.ValidationError(
                    "Calories value seems too high. Please verify."
                )
        return value
    
    def validate(self, data):
        """Validate the entire sweet data."""
        # Check if sweet with same name and category already exists
        name = data.get('name')
        category = data.get('category')
        
        if name and category:
            # Get instance if updating
            instance = self.instance
            
            queryset = Sweet.objects.filter(
                name__iexact=name.strip(),
                category=category
            )
            
            if instance:
                queryset = queryset.exclude(pk=instance.pk)
            
            if queryset.exists():
                raise serializers.ValidationError({
                    'name': f"A sweet with name '{name}' already exists in {category} category."
                })
        
        # Validate price-quantity ratio (business rule example)
        price = data.get('price')
        quantity = data.get('quantity')
        
        if price and quantity:
            total_value = price * quantity
            
            # Example business rule: Inventory value shouldn't exceed 1,00,000
            if total_value > 100000:
                raise serializers.ValidationError({
                    'quantity': f"Total inventory value (₹{total_value:,.2f}) exceeds maximum limit of ₹1,00,000."
                })
        
        return data
    
    def create(self, validated_data):
        """Create a new sweet."""
        # Additional processing before creation
        validated_data['name'] = validated_data['name'].strip()
        
        # Create the sweet
        sweet = Sweet.objects.create(**validated_data)
        
        # Log creation (optional)
        user = self.context.get('request').user if self.context.get('request') else None
        if user:
            print(f"Sweet '{sweet.name}' created by {user.email}")
        
        return sweet
    
    def update(self, instance, validated_data):
        """Update an existing sweet."""
        # Track changes
        changes = {}
        for field, value in validated_data.items():
            old_value = getattr(instance, field)
            if old_value != value:
                changes[field] = {'old': old_value, 'new': value}
        
        # Update instance
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # Save if there are changes
        if changes:
            instance.save()
            
            # Log changes (optional)
            user = self.context.get('request').user if self.context.get('request') else None
            if user:
                print(f"Sweet '{instance.name}' updated by {user.email}: {changes}")
        
        return instance


class SweetListSerializer(serializers.ModelSerializer):
    """
    Simplified serializer for sweet listing.
    """
    is_available = serializers.BooleanField(read_only=True)
    category_display = serializers.CharField(
        source='get_category_display',
        read_only=True
    )
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Sweet
        fields = (
            'id', 'name', 'category', 'category_display',
            'price', 'quantity', 'is_available',
            'image_url', 'is_featured'
        )
    
    def get_image_url(self, obj):
        """Get absolute image URL."""
        if obj.image and hasattr(obj.image, 'url'):
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class PurchaseSerializer(serializers.Serializer):
    """
    Serializer for purchasing sweets.
    """
    quantity = serializers.IntegerField(
        required=True,
        min_value=1,
        max_value=100,
        help_text="Quantity to purchase (1-100)."
    )
    
    def validate_quantity(self, value):
        """Validate purchase quantity."""
        sweet = self.context.get('sweet')
        
        if not sweet:
            raise serializers.ValidationError("Sweet not found.")
        
        if value > sweet.quantity:
            raise serializers.ValidationError(
                f"Only {sweet.quantity} item(s) available in stock."
            )
        
        return value
    
    def create(self, validated_data):
        """Process purchase."""
        sweet = self.context.get('sweet')
        quantity = validated_data['quantity']
        
        # Perform purchase
        success, message = sweet.purchase(quantity)
        
        if not success:
            raise serializers.ValidationError(message)
        
        return {
            'sweet': sweet,
            'quantity': quantity,
            'total_price': sweet.price * quantity,
            'remaining_stock': sweet.quantity,
            'message': message
        }


class RestockSerializer(serializers.Serializer):
    """
    Serializer for restocking sweets.
    """
    quantity = serializers.IntegerField(
        required=True,
        min_value=1,
        max_value=1000,
        help_text="Quantity to restock (1-1000)."
    )
    
    reason = serializers.CharField(
        required=False,
        max_length=200,
        allow_blank=True,
        help_text="Optional reason for restocking."
    )
    
    def create(self, validated_data):
        """Process restock."""
        sweet = self.context.get('sweet')
        quantity = validated_data['quantity']
        reason = validated_data.get('reason', '')
        
        # Perform restock
        success, message = sweet.restock(quantity)
        
        if not success:
            raise serializers.ValidationError(message)
        
        return {
            'sweet': sweet,
            'quantity': quantity,
            'reason': reason,
            'new_stock': sweet.quantity,
            'message': message
        }


class SweetSearchSerializer(serializers.Serializer):
    """
    Serializer for sweet search parameters.
    """
    name = serializers.CharField(required=False, max_length=100)
    category = serializers.CharField(required=False)
    min_price = serializers.DecimalField(
        required=False,
        max_digits=10,
        decimal_places=2,
        min_value=0
    )
    max_price = serializers.DecimalField(
        required=False,
        max_digits=10,
        decimal_places=2,
        min_value=0
    )
    available_only = serializers.BooleanField(required=False, default=False)
    is_featured = serializers.BooleanField(required=False, default=False)
    sort_by = serializers.ChoiceField(
        required=False,
        choices=[
            ('name', 'Name (A-Z)'),
            ('-name', 'Name (Z-A)'),
            ('price', 'Price (Low to High)'),
            ('-price', 'Price (High to Low)'),
            ('quantity', 'Quantity (Low to High)'),
            ('-quantity', 'Quantity (High to Low)'),
            ('created_at', 'Newest First'),
            ('-created_at', 'Oldest First'),
        ],
        default='created_at'
    )
    
    def validate(self, data):
        """Validate search parameters."""
        min_price = data.get('min_price')
        max_price = data.get('max_price')
        
        if min_price and max_price and min_price > max_price:
            raise serializers.ValidationError({
                'min_price': "Minimum price cannot be greater than maximum price."
            })
        
        return data


class SweetStatsSerializer(serializers.Serializer):
    """
    Serializer for sweet statistics.
    """
    total_sweets = serializers.IntegerField()
    total_value = serializers.DecimalField(max_digits=12, decimal_places=2)
    average_price = serializers.DecimalField(max_digits=10, decimal_places=2)
    total_quantity = serializers.IntegerField()
    out_of_stock = serializers.IntegerField()
    low_stock = serializers.IntegerField()
    in_stock = serializers.IntegerField()
    by_category = serializers.DictField()