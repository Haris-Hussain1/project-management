from django.contrib.auth import get_user_model
from rest_framework import serializers

from apps.users.serializers import UserSerializer

from .models import Project, ProjectMembership


User = get_user_model()


class ProjectMembershipSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = ProjectMembership
        fields = (
            "id",
            "user",
            "role",
            "joined_at",
        )
        read_only_fields = (
            "id",
            "user",
            "joined_at",
        )


class AddProjectMemberSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    role = serializers.ChoiceField(
        choices=[
            ProjectMembership.Role.ADMIN,
            ProjectMembership.Role.MEMBER,
            ProjectMembership.Role.VIEWER,
        ],
        default=ProjectMembership.Role.MEMBER,
    )

    def validate_user_id(self, value):
        if not User.objects.filter(
            id=value,
            is_active=True,
        ).exists():
            raise serializers.ValidationError(
                "User does not exist."
            )

        return value


class UpdateProjectMemberSerializer(serializers.Serializer):
    role = serializers.ChoiceField(
        choices=[
            ProjectMembership.Role.ADMIN,
            ProjectMembership.Role.MEMBER,
            ProjectMembership.Role.VIEWER,
        ]
    )


class ProjectSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    members = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = (
            "id",
            "name",
            "description",
            "status",
            "owner",
            "members",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "owner",
            "members",
            "created_at",
            "updated_at",
        )

    def get_members(self, obj):
        memberships = (
            obj.memberships
            .select_related("user")
            .all()
        )

        return ProjectMembershipSerializer(
            memberships,
            many=True,
        ).data

    def validate_name(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Project name cannot be empty."
            )

        return value