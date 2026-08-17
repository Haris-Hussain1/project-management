from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.notifications.models import Notification
from apps.notifications.services import create_notification
from apps.projects.models import Project, ProjectMembership

from .models import Task
from .permissions import IsTaskProjectMember
from .serializers import TaskSerializer


class TaskListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Return all tasks belonging to projects
        where the authenticated user is a member.
        """

        tasks = (
            Task.objects
            .filter(
                project__memberships__user=request.user,
            )
            .select_related(
                "project",
                "created_by",
                "assigned_to",
            )
            .distinct()
        )

        # Optional filters
        project_id = request.query_params.get("project")

        if project_id:
            tasks = tasks.filter(
                project_id=project_id,
            )

        task_status = request.query_params.get("status")

        if task_status:
            tasks = tasks.filter(
                status=task_status,
            )

        priority = request.query_params.get("priority")

        if priority:
            tasks = tasks.filter(
                priority=priority,
            )

        assigned_to = request.query_params.get("assigned_to")

        if assigned_to:
            tasks = tasks.filter(
                assigned_to_id=assigned_to,
            )

        serializer = TaskSerializer(
            tasks,
            many=True,
            context={
                "request": request,
            },
        )

        return Response(
            serializer.data,
        )

    def post(self, request):
        """
        Create a task inside a project where
        the authenticated user is a member.
        """

        project_id = request.data.get("project")

        if not project_id:
            return Response(
                {
                    "project": [
                        "This field is required."
                    ]
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            project = Project.objects.get(
                pk=project_id,
            )
        except Project.DoesNotExist:
            return Response(
                {
                    "detail": "Project not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        is_member = ProjectMembership.objects.filter(
            project=project,
            user=request.user,
        ).exists()

        if not is_member:
            return Response(
                {
                    "detail": (
                        "You must be a member of this "
                        "project to create tasks."
                    )
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = TaskSerializer(
            data=request.data,
            context={
                "request": request,
            },
        )

        serializer.is_valid(
            raise_exception=True,
        )

        task = serializer.save(
            created_by=request.user,
        )

        # Notify the initial assignee.
        if task.assigned_to:
            create_notification(
                recipient=task.assigned_to,
                notification_type=(
                    Notification.NotificationType.TASK_ASSIGNED
                ),
                title="Task Assigned",
                message=(
                    f'You have been assigned the task '
                    f'"{task.title}".'
                ),
                project=task.project,
                task=task,
            )

        response_serializer = TaskSerializer(
            task,
            context={
                "request": request,
            },
        )

        return Response(
            response_serializer.data,
            status=status.HTTP_201_CREATED,
        )


class TaskDetailView(APIView):
    permission_classes = [
        IsAuthenticated,
        IsTaskProjectMember,
    ]

    def get_object(self, pk):
        return (
            Task.objects
            .select_related(
                "project",
                "created_by",
                "assigned_to",
            )
            .get(pk=pk)
        )

    def get(self, request, pk):
        try:
            task = self.get_object(pk)
        except Task.DoesNotExist:
            return Response(
                {
                    "detail": "Task not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        self.check_object_permissions(
            request,
            task,
        )

        serializer = TaskSerializer(
            task,
            context={
                "request": request,
            },
        )

        return Response(
            serializer.data,
        )

    def patch(self, request, pk):
        try:
            task = self.get_object(pk)
        except Task.DoesNotExist:
            return Response(
                {
                    "detail": "Task not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        self.check_object_permissions(
            request,
            task,
        )

        membership = ProjectMembership.objects.filter(
            project=task.project,
            user=request.user,
        ).first()

        if not membership:
            return Response(
                {
                    "detail": "You are not a project member."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        # Preserve the old values before updating.
        old_status = task.status
        old_assigned_to_id = task.assigned_to_id

        serializer = TaskSerializer(
            task,
            data=request.data,
            partial=True,
            context={
                "request": request,
            },
        )

        serializer.is_valid(
            raise_exception=True,
        )

        updated_task = serializer.save()

        # ---------------------------------------------------------
        # TASK ASSIGNED / REASSIGNED
        # ---------------------------------------------------------

        if (
            updated_task.assigned_to_id
            and updated_task.assigned_to_id != old_assigned_to_id
        ):
            create_notification(
                recipient=updated_task.assigned_to,
                notification_type=(
                    Notification.NotificationType.TASK_ASSIGNED
                ),
                title="Task Assigned",
                message=(
                    f'You have been assigned the task '
                    f'"{updated_task.title}".'
                ),
                project=updated_task.project,
                task=updated_task,
            )

        # ---------------------------------------------------------
        # TASK STATUS CHANGED
        # ---------------------------------------------------------

        if updated_task.status != old_status:

            # Notify task creator.
            create_notification(
                recipient=updated_task.created_by,
                notification_type=(
                    Notification.NotificationType.TASK_STATUS_CHANGED
                ),
                title="Task Status Changed",
                message=(
                    f'The status of task '
                    f'"{updated_task.title}" changed from '
                    f'"{old_status}" to '
                    f'"{updated_task.status}".'
                ),
                project=updated_task.project,
                task=updated_task,
            )

            # Notify assignee unless creator and assignee
            # are the same user.
            if (
                updated_task.assigned_to
                and updated_task.assigned_to_id
                != updated_task.created_by_id
            ):
                create_notification(
                    recipient=updated_task.assigned_to,
                    notification_type=(
                        Notification.NotificationType.TASK_STATUS_CHANGED
                    ),
                    title="Task Status Changed",
                    message=(
                        f'The status of task '
                        f'"{updated_task.title}" changed from '
                        f'"{old_status}" to '
                        f'"{updated_task.status}".'
                    ),
                    project=updated_task.project,
                    task=updated_task,
                )

        return Response(
            TaskSerializer(
                updated_task,
                context={
                    "request": request,
                },
            ).data,
        )

    def delete(self, request, pk):
        try:
            task = self.get_object(pk)
        except Task.DoesNotExist:
            return Response(
                {
                    "detail": "Task not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        self.check_object_permissions(
            request,
            task,
        )

        membership = ProjectMembership.objects.filter(
            project=task.project,
            user=request.user,
        ).first()

        if not membership:
            return Response(
                {
                    "detail": "You are not a project member."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        # Only project admins/owners or the task creator
        # can delete a task.
        is_admin = membership.role in [
            ProjectMembership.Role.OWNER,
            ProjectMembership.Role.ADMIN,
        ]

        is_creator = task.created_by_id == request.user.id

        if not is_admin and not is_creator:
            return Response(
                {
                    "detail": (
                        "Only project admins, owners, "
                        "or the task creator can delete "
                        "this task."
                    )
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        task.delete()

        return Response(
            status=status.HTTP_204_NO_CONTENT,
        )