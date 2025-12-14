from django.contrib import admin
from django.utils.html import format_html
from django.db import models
from .models import Sweet

class StockFilter(admin.SimpleListFilter):
    title = 'Stock Status'
    parameter_name = 'stock'
    
    def lookups(self, request, model_admin):
        return (
            ('in_stock', 'In Stock'),
            ('low_stock', 'Low Stock (<10)'),
            ('out_of_stock', 'Out of Stock'),
        )
    
    def queryset(self, request, queryset):
        if self.value() == 'in_stock':
            return queryset.filter(quantity__gt=10)
        if self.value() == 'low_stock':
            return queryset.filter(quantity__range=(1, 10))
        if self.value() == 'out_of_stock':
            return queryset.filter(quantity=0)

class CategoryFilter(admin.SimpleListFilter):
    title = 'Category'
    parameter_name = 'category'
    
    def lookups(self, request, model_admin):
        categories = Sweet.objects.values_list('category', flat=True).distinct()
        return [(cat, cat.title()) for cat in categories]
    
    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(category=self.value())

@admin.register(Sweet)
class SweetAdmin(admin.ModelAdmin):
    # Display fields in list view
    
    list_display = (
        'id', 
        'name_with_link', 
        'category_badge', 
        'price_display',  # Custom method
        'price',          # Actual field (for editing)
        'quantity_bar',   # Custom method  
        'quantity',       # Actual field (for editing)
        'is_available_icon', 
        'total_value', 
        'created_at_short', 
        'actions_column'
    )

    # Filters in sidebar
    list_filter = (CategoryFilter, StockFilter, 'created_at')
    
    # Search functionality
    search_fields = ('name', 'description', 'category')
    search_help_text = "Search by name, description or category"
    
    # Editable in list view
    list_editable = ('price', 'quantity')
    
    # Items per page
    list_per_page = 25
    
    # Default ordering
    ordering = ('-created_at',)
    
    # Readonly fields
    readonly_fields = ('created_at', 'updated_at', 'total_value_calculated', 
                      'availability_status', 'days_since_created')
    
    # Fieldsets for edit view
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'description', 'category'),
            'classes': ('wide',),
        }),
        ('Pricing & Inventory', {
            'fields': ('price', 'quantity', 'total_value_calculated'),
            'classes': ('wide',),
        }),
        ('Status Information', {
            'fields': ('availability_status', 'days_since_created'),
            'classes': ('collapse',),
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )
    
    # Custom display methods
    def name_with_link(self, obj):
        url = f"/admin/api/sweet/{obj.id}/change/"
        return format_html('<a href="{}"><strong>{}</strong></a>', url, obj.name)
    name_with_link.short_description = 'Sweet Name'
    name_with_link.admin_order_field = 'name'
    
    def category_badge(self, obj):
        color_map = {
            'chocolate': 'purple',
            'candy': 'pink',
            'cake': 'orange',
            'cookie': 'brown',
            'dessert': 'blue',
            'indian': 'red',
        }
        color = color_map.get(obj.category, 'gray')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 8px; '
            'border-radius: 12px; font-size: 12px;">{}</span>',
            color, obj.category.title()
        )
    category_badge.short_description = 'Category'
    
    def price_display(self, obj):
        return format_html('<span style="font-weight: bold;">₹{:.2f}</span>', obj.price)
    price_display.short_description = 'Price'
    price_display.admin_order_field = 'price'
    
    def quantity_bar(self, obj):
        max_quantity = 100  # Assuming 100 is max for visualization
        percentage = min(100, (obj.quantity / max_quantity) * 100) if max_quantity > 0 else 0
        
        if obj.quantity == 0:
            color = '#ff4444'
        elif obj.quantity <= 10:
            color = '#ffaa00'
        else:
            color = '#00c851'
        
        bar_html = f'''
        <div style="width: 100px; background-color: #e0e0e0; border-radius: 3px; height: 20px;">
            <div style="width: {percentage}%; background-color: {color}; height: 100%; 
                      border-radius: 3px; text-align: center; color: white; font-size: 12px; 
                      line-height: 20px;">
                {obj.quantity}
            </div>
        </div>
        '''
        return format_html(bar_html)
    quantity_bar.short_description = 'Quantity'
    
    def is_available_icon(self, obj):
        if obj.is_available():
            return format_html(
                '<span style="color: green; font-size: 18px;" title="In Stock">✓</span>'
            )
        else:
            return format_html(
                '<span style="color: red; font-size: 18px;" title="Out of Stock">✗</span>'
            )
    is_available_icon.short_description = 'Stock'
    
    def total_value(self, obj):
        total = obj.price * obj.quantity
        if total > 1000:
            color = 'green'
            weight = 'bold'
        else:
            color = 'black'
            weight = 'normal'
        return format_html(
            '<span style="color: {}; font-weight: {};">₹{:.2f}</span>',
            color, weight, total
        )
    total_value.short_description = 'Total Value'
    
    def created_at_short(self, obj):
        return obj.created_at.strftime("%b %d, %Y")
    created_at_short.short_description = 'Added On'
    
    def actions_column(self, obj):
        purchase_url = f"/admin/api/sweet/{obj.id}/purchase/"
        restock_url = f"/admin/api/sweet/{obj.id}/restock/"
        return format_html(
            '''
            <div style="display: flex; gap: 5px;">
                <a href="{}" style="background: #4CAF50; color: white; padding: 2px 8px; 
                   border-radius: 3px; text-decoration: none; font-size: 12px;">Purchase</a>
                <a href="{}" style="background: #2196F3; color: white; padding: 2px 8px; 
                   border-radius: 3px; text-decoration: none; font-size: 12px;">Restock</a>
            </div>
            ''',
            purchase_url, restock_url
        )
    actions_column.short_description = 'Actions'
    
    # Readonly field methods
    def total_value_calculated(self, obj):
        return f"₹{obj.price * obj.quantity:.2f}"
    total_value_calculated.short_description = 'Total Inventory Value'
    
    def availability_status(self, obj):
        if obj.quantity == 0:
            return "❌ Out of Stock"
        elif obj.quantity <= 10:
            return "⚠️ Low Stock"
        else:
            return "✅ In Stock"
    availability_status.short_description = 'Stock Status'
    
    def days_since_created(self, obj):
        from django.utils import timezone
        days = (timezone.now() - obj.created_at).days
        return f"{days} days ago"
    days_since_created.short_description = 'Age'
    
    # Custom actions
    actions = ['restock_50', 'restock_100', 'clear_stock', 'increase_price_10_percent']
    
    def restock_50(self, request, queryset):
        updated = queryset.update(quantity=models.F('quantity') + 50)
        self.message_user(
            request, 
            f"Successfully restocked {updated} item(s) by 50 units each.",
            level='success'
        )
    restock_50.short_description = "➕ Restock 50 units"
    
    def restock_100(self, request, queryset):
        updated = queryset.update(quantity=models.F('quantity') + 100)
        self.message_user(
            request, 
            f"Successfully restocked {updated} item(s) by 100 units each.",
            level='success'
        )
    restock_100.short_description = "➕➕ Restock 100 units"
    
    def clear_stock(self, request, queryset):
        updated = queryset.update(quantity=0)
        self.message_user(
            request, 
            f"Cleared stock for {updated} item(s).",
            level='warning'
        )
    clear_stock.short_description = "🗑️ Clear stock"
    
    def increase_price_10_percent(self, request, queryset):
        for sweet in queryset:
            sweet.price = sweet.price * 1.10
            sweet.save()
        self.message_user(
            request,
            f"Increased price by 10% for {queryset.count()} item(s).",
            level='success'
        )
    increase_price_10_percent.short_description = "💰 Increase price 10%"
    
    # Custom admin methods
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        # Add annotations for better sorting
        return qs.annotate(
            total_value_calc=models.F('price') * models.F('quantity')
        )
    
    # Change list template (optional)
    change_list_template = 'admin/api/sweet/change_list.html'

# Custom admin site header
admin.site.site_header = "🍬 Sweet Shop Management System"
admin.site.site_title = "Sweet Shop Admin"
admin.site.index_title = "🎯 Dashboard"