from rest_framework.permissions import BasePermission

from .models import ProjectMembership


class IsProjectMember(BasePermission):
    """
    Allows access only to authenticated users
    who belong to the project.
    """

    def has_object_permission(self, request, view, obj):
        return ProjectMembership.objects.filter(
            project=obj,
            user=request.user,
        ).exists()


class IsProjectAdmin(BasePermission):
    """
    Allows access to project owners and admins.
    """

    def has_object_permission(self, request, view, obj):
        return ProjectMembership.objects.filter(
            project=obj,
            user=request.user,
            role__in=[
                ProjectMembership.Role.OWNER,
                ProjectMembership.Role.ADMIN,
            ],
        ).exists()