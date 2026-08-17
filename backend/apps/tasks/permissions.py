from rest_framework.permissions import BasePermission

from apps.projects.models import ProjectMembership


class IsTaskProjectMember(BasePermission):
    """
    Allows access only to users who are members
    of the project associated with the task.
    """

    def has_object_permission(self, request, view, obj):
        return ProjectMembership.objects.filter(
            project=obj.project,
            user=request.user,
        ).exists()


class IsTaskProjectAdmin(BasePermission):
    """
    Allows access only to project owners and admins.
    """

    def has_object_permission(self, request, view, obj):
        return ProjectMembership.objects.filter(
            project=obj.project,
            user=request.user,
            role__in=[
                ProjectMembership.Role.OWNER,
                ProjectMembership.Role.ADMIN,
            ],
        ).exists()