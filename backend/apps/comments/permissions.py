from rest_framework.permissions import BasePermission

from apps.projects.models import ProjectMembership
from apps.tasks.models import Task


class IsTaskProjectMember(BasePermission):
    """
    Allows access only to users who are members
    of the project containing the task.
    """

    def has_permission(self, request, view):
        project_id = view.kwargs.get("project_id")

        if not project_id:
            return False

        return ProjectMembership.objects.filter(
            project_id=project_id,
            user=request.user,
        ).exists()