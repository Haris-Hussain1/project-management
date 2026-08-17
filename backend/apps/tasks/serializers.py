from django.contrib.auth import get_user_model
from rest_framework import serializers

from apps.projects.models import Project
from apps.users.serializers import UserSerializer

from .models import Task


User = get_user_model()


class TaskSerializer(serializers.ModelSerializer):
    project = serializers.PrimaryKeyRelatedField(
        queryset=Project.objects.all(),
    )

    created_by = UserSerializer(
        read_only=True,
    )

    assigned_to = UserSerializer(
        read_only=True,
    )

    assigned_to_id = serializers.IntegerField(
        write_only=True,
        required=False,
        allow_null=True,
    )

    class Meta:
        model = Task
        fields = (
            "id",
            "project",
            "title",
            "description",
            "status",
            "priority",
            "created_by",
            "assigned_to",
            "assigned_to_id",
            "due_date",
            "created_at",
            "updated_at",
        )

        read_only_fields = (
            "id",
            "created_by",
            "assigned_to",
            "created_at",
            "updated_at",
        )

    def validate_project(self, project):
        request = self.context["request"]

        if not project.memberships.filter(
            user=request.user,
        ).exists():
            raise serializers.ValidationError(
                "You must be a member of this project."
            )

        return project

    def validate_assigned_to_id(self, value):
        if value is None:
            return value

        if not User.objects.filter(
            id=value,
            is_active=True,
        ).exists():
            raise serializers.ValidationError(
                "Assigned user does not exist."
            )

        project = self.initial_data.get("project")

        if project:
            try:
                project = Project.objects.get(
                    id=project,
                )
            except Project.DoesNotExist:
                return value

            if not project.memberships.filter(
                user_id=value,
            ).exists():
                raise serializers.ValidationError(
                    "Assigned user must be a member of the project."
                )

        return value

    def create(self, validated_data):
        assigned_to_id = validated_data.pop(
            "assigned_to_id",
            None,
        )

        task = Task.objects.create(
            **validated_data,
        )

        if assigned_to_id is not None:
            task.assigned_to_id = assigned_to_id
            task.save(
                update_fields=["assigned_to"],
            )

        return task

    def update(self, instance, validated_data):
        assigned_to_id = validated_data.pop(
            "assigned_to_id",
            serializers.empty,
        )

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if assigned_to_id is not serializers.empty:
            instance.assigned_to_id = assigned_to_id

        instance.save()

        return instance