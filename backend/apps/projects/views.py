from django.contrib.auth import get_user_model
from django.db import transaction

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.notifications.models import Notification

from .models import Project, ProjectMembership
from .permissions import IsProjectAdmin, IsProjectMember
from .serializers import (
    AddProjectMemberSerializer,
    ProjectMembershipSerializer,
    ProjectSerializer,
    UpdateProjectMemberSerializer,
)


User = get_user_model()


class ProjectListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        projects = (
            Project.objects
            .filter(
                memberships__user=request.user,
            )
            .select_related("owner")
            .prefetch_related("memberships__user")
            .distinct()
        )

        serializer = ProjectSerializer(
            projects,
            many=True,
        )

        return Response(serializer.data)

    @transaction.atomic
    def post(self, request):
        serializer = ProjectSerializer(
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        project = serializer.save(
            owner=request.user,
        )

        ProjectMembership.objects.create(
            project=project,
            user=request.user,
            role=ProjectMembership.Role.OWNER,
        )

        response_serializer = ProjectSerializer(
            project,
        )

        return Response(
            response_serializer.data,
            status=status.HTTP_201_CREATED,
        )


class ProjectDetailView(APIView):
    permission_classes = [
        IsAuthenticated,
        IsProjectMember,
    ]

    def get_object(self, pk):
        return (
            Project.objects
            .select_related("owner")
            .prefetch_related("memberships__user")
            .get(pk=pk)
        )

    def get(self, request, pk):
        try:
            project = self.get_object(pk)
        except Project.DoesNotExist:
            return Response(
                {"detail": "Project not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        self.check_object_permissions(
            request,
            project,
        )

        serializer = ProjectSerializer(project)

        return Response(serializer.data)

    def patch(self, request, pk):
        try:
            project = self.get_object(pk)
        except Project.DoesNotExist:
            return Response(
                {"detail": "Project not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        self.check_object_permissions(
            request,
            project,
        )

        if not IsProjectAdmin().has_object_permission(
            request,
            self,
            project,
        ):
            return Response(
                {
                    "detail": (
                        "Only project owners and admins "
                        "can update the project."
                    )
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = ProjectSerializer(
            project,
            data=request.data,
            partial=True,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        serializer.save()

        return Response(serializer.data)

    def delete(self, request, pk):
        try:
            project = self.get_object(pk)
        except Project.DoesNotExist:
            return Response(
                {"detail": "Project not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        self.check_object_permissions(
            request,
            project,
        )

        if not IsProjectAdmin().has_object_permission(
            request,
            self,
            project,
        ):
            return Response(
                {
                    "detail": (
                        "Only project owners and admins "
                        "can delete the project."
                    )
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        project.delete()

        return Response(
            status=status.HTTP_204_NO_CONTENT,
        )


class ProjectMemberListCreateView(APIView):
    permission_classes = [
        IsAuthenticated,
        IsProjectMember,
    ]

    def get_project(self, pk):
        return (
            Project.objects
            .select_related("owner")
            .get(pk=pk)
        )

    def get(self, request, pk):
        try:
            project = self.get_project(pk)
        except Project.DoesNotExist:
            return Response(
                {"detail": "Project not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        self.check_object_permissions(
            request,
            project,
        )

        memberships = (
            ProjectMembership.objects
            .filter(project=project)
            .select_related("user")
        )

        serializer = ProjectMembershipSerializer(
            memberships,
            many=True,
        )

        return Response(serializer.data)

    @transaction.atomic
    def post(self, request, pk):
        try:
            project = self.get_project(pk)
        except Project.DoesNotExist:
            return Response(
                {"detail": "Project not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        self.check_object_permissions(
            request,
            project,
        )

        if not IsProjectAdmin().has_object_permission(
            request,
            self,
            project,
        ):
            return Response(
                {
                    "detail": (
                        "Only project owners and admins "
                        "can add members."
                    )
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = AddProjectMemberSerializer(
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        user = User.objects.get(
            id=serializer.validated_data["user_id"],
        )

        role = serializer.validated_data["role"]

        if ProjectMembership.objects.filter(
            project=project,
            user=user,
        ).exists():
            return Response(
                {
                    "detail": (
                        "User is already a member "
                        "of this project."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        membership = ProjectMembership.objects.create(
            project=project,
            user=user,
            role=role,
        )

        Notification.objects.create(
            recipient=user,
            notification_type=(
                Notification.NotificationType.PROJECT_MEMBER_ADDED
            ),
            title="Added to project",
            message=(
                f"You have been added to the project "
                f"'{project.name}' as {membership.get_role_display()}."
            ),
            project=project,
        )

        response_serializer = ProjectMembershipSerializer(
            membership,
        )

        return Response(
            response_serializer.data,
            status=status.HTTP_201_CREATED,
        )


class ProjectMemberDetailView(APIView):
    permission_classes = [
        IsAuthenticated,
        IsProjectMember,
    ]

    def get_project(self, pk):
        return Project.objects.get(pk=pk)

    def patch(self, request, pk, user_id):
        try:
            project = self.get_project(pk)
        except Project.DoesNotExist:
            return Response(
                {"detail": "Project not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        self.check_object_permissions(
            request,
            project,
        )

        if not IsProjectAdmin().has_object_permission(
            request,
            self,
            project,
        ):
            return Response(
                {
                    "detail": (
                        "Only project owners and admins "
                        "can update members."
                    )
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        try:
            membership = (
                ProjectMembership.objects
                .select_related("user", "project")
                .get(
                    project=project,
                    user_id=user_id,
                )
            )
        except ProjectMembership.DoesNotExist:
            return Response(
                {"detail": "Project member not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if membership.role == ProjectMembership.Role.OWNER:
            return Response(
                {
                    "detail": (
                        "The project owner role "
                        "cannot be changed."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = UpdateProjectMemberSerializer(
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        old_role = membership.get_role_display()
        new_role = serializer.validated_data["role"]

        membership.role = new_role

        membership.save(
            update_fields=["role"],
        )

        Notification.objects.create(
            recipient=membership.user,
            notification_type=(
                Notification.NotificationType.PROJECT_MEMBER_ADDED
            ),
            title="Project role updated",
            message=(
                f"Your role in '{project.name}' changed "
                f"from {old_role} to "
                f"{membership.get_role_display()}."
            ),
            project=project,
        )

        response_serializer = ProjectMembershipSerializer(
            membership,
        )

        return Response(
            response_serializer.data,
        )

    def delete(self, request, pk, user_id):
        try:
            project = self.get_project(pk)
        except Project.DoesNotExist:
            return Response(
                {"detail": "Project not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        self.check_object_permissions(
            request,
            project,
        )

        if not IsProjectAdmin().has_object_permission(
            request,
            self,
            project,
        ):
            return Response(
                {
                    "detail": (
                        "Only project owners and admins "
                        "can remove members."
                    )
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        try:
            membership = (
                ProjectMembership.objects
                .select_related("user", "project")
                .get(
                    project=project,
                    user_id=user_id,
                )
            )
        except ProjectMembership.DoesNotExist:
            return Response(
                {"detail": "Project member not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if membership.role == ProjectMembership.Role.OWNER:
            return Response(
                {
                    "detail": (
                        "The project owner cannot "
                        "be removed."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = membership.user

        membership.delete()

        Notification.objects.create(
            recipient=user,
            notification_type=(
                Notification.NotificationType.PROJECT_MEMBER_REMOVED
            ),
            title="Removed from project",
            message=(
                f"You have been removed from the project "
                f"'{project.name}'."
            ),
            project=project,
        )

        return Response(
            status=status.HTTP_204_NO_CONTENT,
        )