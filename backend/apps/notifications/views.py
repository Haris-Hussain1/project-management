from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Notification
from .permissions import IsNotificationRecipient
from .serializers import (
    NotificationReadSerializer,
    NotificationSerializer,
)


class NotificationListView(APIView):
    permission_classes = [
        IsAuthenticated,
    ]

    def get(self, request):
        notifications = (
            Notification.objects
            .filter(recipient=request.user)
            .select_related(
                "recipient",
                "project",
                "task",
            )
        )

        serializer = NotificationSerializer(
            notifications,
            many=True,
        )

        return Response(serializer.data)


class NotificationUnreadCountView(APIView):
    permission_classes = [
        IsAuthenticated,
    ]

    def get(self, request):
        count = Notification.objects.filter(
            recipient=request.user,
            is_read=False,
        ).count()

        return Response(
            {
                "count": count,
            }
        )


class NotificationDetailView(APIView):
    permission_classes = [
        IsAuthenticated,
        IsNotificationRecipient,
    ]

    def get_notification(self, pk):
        return (
            Notification.objects
            .select_related(
                "recipient",
                "project",
                "task",
            )
            .get(pk=pk)
        )

    def get(self, request, pk):
        try:
            notification = self.get_notification(pk)
        except Notification.DoesNotExist:
            return Response(
                {
                    "detail": "Notification not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        self.check_object_permissions(
            request,
            notification,
        )

        serializer = NotificationSerializer(
            notification,
        )

        return Response(serializer.data)

    def patch(self, request, pk):
        try:
            notification = self.get_notification(pk)
        except Notification.DoesNotExist:
            return Response(
                {
                    "detail": "Notification not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        self.check_object_permissions(
            request,
            notification,
        )

        serializer = NotificationReadSerializer(
            notification,
            data=request.data,
            partial=True,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        serializer.save()

        response_serializer = NotificationSerializer(
            notification,
        )

        return Response(
            response_serializer.data,
        )

    def delete(self, request, pk):
        try:
            notification = self.get_notification(pk)
        except Notification.DoesNotExist:
            return Response(
                {
                    "detail": "Notification not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        self.check_object_permissions(
            request,
            notification,
        )

        notification.delete()

        return Response(
            status=status.HTTP_204_NO_CONTENT,
        )


class NotificationMarkAllReadView(APIView):
    permission_classes = [
        IsAuthenticated,
    ]

    def post(self, request):
        updated_count = (
            Notification.objects
            .filter(
                recipient=request.user,
                is_read=False,
            )
            .update(is_read=True)
        )

        return Response(
            {
                "detail": "All notifications marked as read.",
                "updated_count": updated_count,
            }
        )