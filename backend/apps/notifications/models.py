from django.conf import settings
from django.db import models


class Notification(models.Model):
    class NotificationType(models.TextChoices):
        PROJECT_INVITATION = (
            "project_invitation",
            "Project Invitation",
        )
        PROJECT_MEMBER_ADDED = (
            "project_member_added",
            "Project Member Added",
        )
        PROJECT_MEMBER_REMOVED = (
            "project_member_removed",
            "Project Member Removed",
        )
        TASK_ASSIGNED = (
            "task_assigned",
            "Task Assigned",
        )
        TASK_STATUS_CHANGED = (
            "task_status_changed",
            "Task Status Changed",
        )
        COMMENT_ADDED = (
            "comment_added",
            "Comment Added",
        )

    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notifications",
    )

    notification_type = models.CharField(
        max_length=50,
        choices=NotificationType.choices,
    )

    title = models.CharField(
        max_length=200,
    )

    message = models.TextField()

    project = models.ForeignKey(
        "projects.Project",
        on_delete=models.CASCADE,
        related_name="notifications",
        null=True,
        blank=True,
    )

    task = models.ForeignKey(
        "tasks.Task",
        on_delete=models.CASCADE,
        related_name="notifications",
        null=True,
        blank=True,
    )

    is_read = models.BooleanField(
        default=False,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.recipient.username} - {self.title}"