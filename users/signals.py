from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.contrib.auth import get_user_model
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)
User = get_user_model()


@receiver(pre_save, sender=User)
def user_pre_save(sender, instance, **kwargs):
    """
    Signal triggered before a User is saved.
    """
    # Ensure email is lowercase
    if instance.email:
        instance.email = instance.email.lower().strip()
    
    # Ensure username is stripped
    if instance.username:
        instance.username = instance.username.strip()
    
    # If user is being made superuser, also make them admin
    if instance.is_superuser and not instance.is_admin:
        instance.is_admin = True
        instance.is_staff = True
    
    # If user is admin, ensure they are staff
    if instance.is_admin and not instance.is_staff:
        instance.is_staff = True


@receiver(post_save, sender=User)
def user_post_save(sender, instance, created, **kwargs):
    """
    Signal triggered after a User is saved.
    """
    if created:
        # Send welcome email to new user
        send_welcome_email(instance)
        
        # Log user creation
        logger.info(f"New user created: {instance.email} (ID: {instance.id})")
        
        # Create user profile if needed (if you have a Profile model)
        # create_user_profile(instance)
    
    else:
        # Log user update
        logger.debug(f"User updated: {instance.email} (ID: {instance.id})")
        
        # Check if user was deactivated
        if not instance.is_active:
            # Log deactivation
            logger.warning(f"User deactivated: {instance.email}")
            
            # Send deactivation email
            send_deactivation_email(instance)


def send_welcome_email(user):
    """
    Send welcome email to new user.
    """
    try:
        subject = 'Welcome to Sweet Shop Management System! 🍬'
        
        # HTML content
        html_message = render_to_string('emails/welcome_email.html', {
            'user': user,
            'site_name': 'Sweet Shop',
            'current_year': timezone.now().year,
            'login_url': f"{settings.FRONTEND_URL}/login" if hasattr(settings, 'FRONTEND_URL') else '#',
        })
        
        # Plain text version
        plain_message = strip_tags(html_message)
        
        # Send email
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            html_message=html_message,
            fail_silently=True,
        )
        
        logger.info(f"Welcome email sent to {user.email}")
        
    except Exception as e:
        logger.error(f"Failed to send welcome email to {user.email}: {str(e)}")


def send_deactivation_email(user):
    """
    Send email when user is deactivated.
    """
    try:
        subject = 'Your Sweet Shop Account Has Been Deactivated'
        
        html_message = render_to_string('emails/deactivation_email.html', {
            'user': user,
            'site_name': 'Sweet Shop',
            'contact_email': settings.CONTACT_EMAIL if hasattr(settings, 'CONTACT_EMAIL') else 'support@sweetshop.com',
        })
        
        plain_message = strip_tags(html_message)
        
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            html_message=html_message,
            fail_silently=True,
        )
        
        logger.info(f"Deactivation email sent to {user.email}")
        
    except Exception as e:
        logger.error(f"Failed to send deactivation email to {user.email}: {str(e)}")


def create_user_profile(user):
    """
    Create a user profile when user is created.
    (Optional - if you have a Profile model)
    """
    try:
        # If you have a Profile model, uncomment this:
        # Profile.objects.get_or_create(user=user)
        pass
    except Exception as e:
        logger.error(f"Failed to create profile for user {user.email}: {str(e)}")


@receiver(post_save, sender=User)
def log_user_activity(sender, instance, created, **kwargs):
    """
    Log user activity for audit trail.
    """
    from django.contrib.admin.models import LogEntry, ADDITION, CHANGE
    from django.contrib.contenttypes.models import ContentType
    
    if created:
        # Log user creation in admin log
        LogEntry.objects.log_action(
            user_id=instance.pk if instance.pk else 1,
            content_type_id=ContentType.objects.get_for_model(User).pk,
            object_id=instance.pk,
            object_repr=str(instance),
            action_flag=ADDITION,
            change_message='User created via registration'
        )
    
    # Note: For updates, Django admin already logs changes


# Email templates directory (create this)
# Create directory: templates/emails/
# Files: welcome_email.html, deactivation_email.html