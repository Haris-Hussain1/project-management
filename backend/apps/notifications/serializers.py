from rest_framework import serializers

from apps.users.serializers import UserSerializer

from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    recipient = UserSerializer(read_only=True)

    class Meta:
        model = Notification
        fields = (
            "id",
            "recipient",
            "notification_type",
            "title",
            "message",
            "project",
            "task",
            "is_read",
            "created_at",
        )

        read_only_fields = (
            "id",
            "recipient",
            "notification_type",
            "title",
            "message",
            "project",
            "task",
            "created_at",
        )


class NotificationReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = (
            "is_read",
        )