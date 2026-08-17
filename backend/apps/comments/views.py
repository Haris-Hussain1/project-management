from django.db import transaction
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.notifications.models import Notification
from apps.projects.models import ProjectMembership
from apps.tasks.models import Task

from .models import Comment
from .permissions import IsTaskProjectMember
from .serializers import CommentSerializer


class CommentListCreateView(APIView):
    permission_classes = [
        IsAuthenticated,
        IsTaskProjectMember,
    ]

    def get_task(self, project_id, task_id):
        return (
            Task.objects
            .select_related(
                "project",
                "created_by",
                "assigned_to",
            )
            .get(
                id=task_id,
                project_id=project_id,
            )
        )

    def check_task_permission(self, request, task):
        permission = IsTaskProjectMember()

        if not permission.has_object_permission(
            request,
            self,
            task,
        ):
            return Response(
                {
                    "detail": (
                        "You are not a member of this project."
                    )
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        return None

    def get(self, request, project_id, task_id):
        try:
            task = self.get_task(
                project_id,
                task_id,
            )
        except Task.DoesNotExist:
            return Response(
                {
                    "detail": "Task not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        permission_response = self.check_task_permission(
            request,
            task,
        )

        if permission_response:
            return permission_response

        comments = (
            Comment.objects
            .filter(task=task)
            .select_related("author")
            .order_by("created_at")
        )

        serializer = CommentSerializer(
            comments,
            many=True,
        )

        return Response(serializer.data)

    @transaction.atomic
    def post(self, request, project_id, task_id):
        try:
            task = self.get_task(
                project_id,
                task_id,
            )
        except Task.DoesNotExist:
            return Response(
                {
                    "detail": "Task not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        permission_response = self.check_task_permission(
            request,
            task,
        )

        if permission_response:
            return permission_response

        serializer = CommentSerializer(
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        comment = serializer.save(
            task=task,
            author=request.user,
        )

        # ---------------------------------------------------------
        # COMMENT NOTIFICATIONS
        # ---------------------------------------------------------

        recipients = set()

        # Notify task creator.
        if task.created_by_id != request.user.id:
            recipients.add(task.created_by_id)

        # Notify assigned user.
        if (
            task.assigned_to_id
            and task.assigned_to_id != request.user.id
        ):
            recipients.add(task.assigned_to_id)

        # Notify other project members.
        member_ids = (
            ProjectMembership.objects
            .filter(
                project_id=project_id,
            )
            .exclude(
                user_id=request.user.id,
            )
            .values_list(
                "user_id",
                flat=True,
            )
        )

        recipients.update(member_ids)

        notifications = [
            Notification(
                recipient_id=user_id,
                notification_type=(
                    Notification.NotificationType.COMMENT_ADDED
                ),
                title="New Comment",
                message=(
                    f'{request.user.username} commented on '
                    f'task "{task.title}".'
                ),
                project=task.project,
                task=task,
            )
            for user_id in recipients
        ]

        if notifications:
            Notification.objects.bulk_create(
                notifications,
            )

        response_serializer = CommentSerializer(
            comment,
        )

        return Response(
            response_serializer.data,
            status=status.HTTP_201_CREATED,
        )


class CommentDetailView(APIView):
    permission_classes = [
        IsAuthenticated,
        IsTaskProjectMember,
    ]

    def get_comment(
        self,
        project_id,
        task_id,
        comment_id,
    ):
        return (
            Comment.objects
            .select_related(
                "author",
                "task",
                "task__project",
            )
            .get(
                id=comment_id,
                task_id=task_id,
                task__project_id=project_id,
            )
        )

    def check_task_permission(self, request, comment):
        permission = IsTaskProjectMember()

        if not permission.has_object_permission(
            request,
            self,
            comment.task,
        ):
            return Response(
                {
                    "detail": (
                        "You are not a member of this project."
                    )
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        return None

    def get(
        self,
        request,
        project_id,
        task_id,
        comment_id,
    ):
        try:
            comment = self.get_comment(
                project_id,
                task_id,
                comment_id,
            )
        except Comment.DoesNotExist:
            return Response(
                {
                    "detail": "Comment not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        permission_response = self.check_task_permission(
            request,
            comment,
        )

        if permission_response:
            return permission_response

        serializer = CommentSerializer(
            comment,
        )

        return Response(serializer.data)

    def patch(
        self,
        request,
        project_id,
        task_id,
        comment_id,
    ):
        try:
            comment = self.get_comment(
                project_id,
                task_id,
                comment_id,
            )
        except Comment.DoesNotExist:
            return Response(
                {
                    "detail": "Comment not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        permission_response = self.check_task_permission(
            request,
            comment,
        )

        if permission_response:
            return permission_response

        if comment.author_id != request.user.id:
            return Response(
                {
                    "detail": (
                        "You can only edit your own comments."
                    )
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = CommentSerializer(
            comment,
            data=request.data,
            partial=True,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        serializer.save()

        return Response(
            serializer.data,
        )

    def delete(
        self,
        request,
        project_id,
        task_id,
        comment_id,
    ):
        try:
            comment = self.get_comment(
                project_id,
                task_id,
                comment_id,
            )
        except Comment.DoesNotExist:
            return Response(
                {
                    "detail": "Comment not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        permission_response = self.check_task_permission(
            request,
            comment,
        )

        if permission_response:
            return permission_response

        is_author = (
            comment.author_id == request.user.id
        )

        is_project_admin = (
            ProjectMembership.objects
            .filter(
                project_id=project_id,
                user=request.user,
                role__in=[
                    ProjectMembership.Role.OWNER,
                    ProjectMembership.Role.ADMIN,
                ],
            )
            .exists()
        )

        if not is_author and not is_project_admin:
            return Response(
                {
                    "detail": (
                        "You can only delete your own "
                        "comments unless you are a "
                        "project admin."
                    )
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        comment.delete()

        return Response(
            status=status.HTTP_204_NO_CONTENT,
        )