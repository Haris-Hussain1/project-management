from rest_framework.permissions import BasePermission


class IsNotificationRecipient(BasePermission):
    """
    Allows access only to the user who received
    the notification.
    """

    def has_object_permission(
        self,
        request,
        view,
        obj,
    ):
        return (
            obj.recipient_id == request.user.id
        )