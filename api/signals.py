from django.db.models.signals import post_save, pre_save, post_delete, m2m_changed
from django.dispatch import receiver
from django.conf import settings
from django.core.mail import mail_admins
from django.utils import timezone
import logging
from .models import Sweet

logger = logging.getLogger(__name__)


@receiver(pre_save, sender=Sweet)
def sweet_pre_save(sender, instance, **kwargs):
    """
    Signal triggered before a Sweet is saved.
    """
    # Track changes for audit
    if instance.pk:
        try:
            old_instance = Sweet.objects.get(pk=instance.pk)
            instance._old_quantity = old_instance.quantity
            instance._old_price = old_instance.price
        except Sweet.DoesNotExist:
            instance._old_quantity = None
            instance._old_price = None
    else:
        instance._old_quantity = None
        instance._old_price = None
    
    # Validate and clean data
    if instance.name:
        instance.name = instance.name.strip()
    
    if instance.description:
        instance.description = instance.description.strip()
    
    # Auto-feature high-value sweets
    if instance.price * instance.quantity > 50000:  # If inventory value > 50k
        instance.is_featured = True


@receiver(post_save, sender=Sweet)
def sweet_post_save(sender, instance, created, **kwargs):
    """
    Signal triggered after a Sweet is saved.
    """
    if created:
        # Log creation
        logger.info(f"New sweet created: {instance.name} (ID: {instance.id})")
        
        # Send notification to admins for new high-value sweets
        if instance.price * instance.quantity > 10000:
            send_new_high_value_sweet_notification(instance)
    
    else:
        # Log updates
        changes = []
        
        if hasattr(instance, '_old_quantity') and instance._old_quantity != instance.quantity:
            change = f"Quantity: {instance._old_quantity} → {instance.quantity}"
            changes.append(change)
            
            # Check if stock is critically low
            if instance.quantity <= 10 and instance._old_quantity > 10:
                send_low_stock_alert(instance)
            
            # Check if restocked from zero
            if instance.quantity > 0 and instance._old_quantity == 0:
                send_restock_notification(instance)
        
        if hasattr(instance, '_old_price') and instance._old_price != instance.price:
            change = f"Price: {instance._old_price} → {instance.price}"
            changes.append(change)
        
        if changes:
            logger.info(f"Sweet updated: {instance.name} - {', '.join(changes)}")
        
        # Check if sweet went out of stock
        if instance.quantity == 0 and hasattr(instance, '_old_quantity') and instance._old_quantity > 0:
            send_out_of_stock_alert(instance)


@receiver(post_delete, sender=Sweet)
def sweet_post_delete(sender, instance, **kwargs):
    """
    Signal triggered after a Sweet is deleted.
    """
    logger.warning(f"Sweet deleted: {instance.name} (ID: {instance.id})")
    
    # Send deletion notification to admins
    send_deletion_notification(instance)


def send_low_stock_alert(sweet):
    """
    Send alert when sweet stock is low (<= 10).
    """
    try:
        subject = f'⚠️ Low Stock Alert: {sweet.name}'
        
        message = f"""
        Low Stock Alert!
        
        Sweet: {sweet.name}
        Category: {sweet.get_category_display()}
        Current Stock: {sweet.quantity}
        Price: ₹{sweet.price}
        
        Please consider restocking soon.
        
        ---
        Sweet Shop Management System
        """
        
        # Send to admins
        mail_admins(
            subject=subject,
            message=message,
            fail_silently=True,
        )
        
        logger.info(f"Low stock alert sent for {sweet.name}")
        
    except Exception as e:
        logger.error(f"Failed to send low stock alert: {str(e)}")


def send_out_of_stock_alert(sweet):
    """
    Send alert when sweet goes out of stock.
    """
    try:
        subject = f'🚨 Out of Stock: {sweet.name}'
        
        message = f"""
        OUT OF STOCK!
        
        Sweet: {sweet.name}
        Category: {sweet.get_category_display()}
        Price: ₹{sweet.price}
        
        This sweet is now out of stock. Please restock immediately.
        
        ---
        Sweet Shop Management System
        """
        
        mail_admins(
            subject=subject,
            message=message,
            fail_silently=True,
        )
        
        logger.warning(f"Out of stock alert sent for {sweet.name}")
        
    except Exception as e:
        logger.error(f"Failed to send out of stock alert: {str(e)}")


def send_restock_notification(sweet):
    """
    Send notification when sweet is restocked.
    """
    try:
        subject = f'✅ Restocked: {sweet.name}'
        
        message = f"""
        Sweet Restocked!
        
        Sweet: {sweet.name}
        Category: {sweet.get_category_display()}
        New Stock: {sweet.quantity}
        Price: ₹{sweet.price}
        
        This sweet has been restocked and is now available.
        
        ---
        Sweet Shop Management System
        """
        
        mail_admins(
            subject=subject,
            message=message,
            fail_silently=True,
        )
        
        logger.info(f"Restock notification sent for {sweet.name}")
        
    except Exception as e:
        logger.error(f"Failed to send restock notification: {str(e)}")


def send_new_high_value_sweet_notification(sweet):
    """
    Send notification for new high-value sweet.
    """
    try:
        subject = f'💰 New High-Value Sweet: {sweet.name}'
        
        total_value = sweet.price * sweet.quantity
        
        message = f"""
        New High-Value Sweet Added!
        
        Sweet: {sweet.name}
        Category: {sweet.get_category_display()}
        Price: ₹{sweet.price}
        Quantity: {sweet.quantity}
        Total Inventory Value: ₹{total_value:,.2f}
        
        This is a high-value item in inventory.
        
        ---
        Sweet Shop Management System
        """
        
        mail_admins(
            subject=subject,
            message=message,
            fail_silently=True,
        )
        
        logger.info(f"High-value sweet notification sent for {sweet.name}")
        
    except Exception as e:
        logger.error(f"Failed to send high-value sweet notification: {str(e)}")


def send_deletion_notification(sweet):
    """
    Send notification when sweet is deleted.
    """
    try:
        subject = f'🗑️ Sweet Deleted: {sweet.name}'
        
        message = f"""
        Sweet Deleted!
        
        Sweet: {sweet.name}
        Category: {sweet.get_category_display()}
        Price: ₹{sweet.price}
        Was in stock: {sweet.quantity} units
        
        This sweet has been permanently deleted from the system.
        
        ---
        Sweet Shop Management System
        """
        
        mail_admins(
            subject=subject,
            message=message,
            fail_silently=True,
        )
        
        logger.warning(f"Deletion notification sent for {sweet.name}")
        
    except Exception as e:
        logger.error(f"Failed to send deletion notification: {str(e)}")


# Audit logging for sweet transactions
@receiver(post_save, sender=Sweet)
def create_inventory_audit_log(sender, instance, created, **kwargs):
    """
    Create audit log for inventory changes.
    (Optional - if you have an AuditLog model)
    """
    try:
        # If you have an AuditLog model, implement here
        # from .models import AuditLog
        # if not created and hasattr(instance, '_old_quantity') and instance._old_quantity != instance.quantity:
        #     AuditLog.objects.create(
        #         sweet=instance,
        #         user=instance.last_modified_by,  # Need to track this
        #         change_type='QUANTITY_CHANGE',
        #         old_value=instance._old_quantity,
        #         new_value=instance.quantity,
        #         notes=f'Quantity changed from {instance._old_quantity} to {instance.quantity}'
        #     )
        pass
    except Exception as e:
        logger.error(f"Failed to create audit log: {str(e)}")