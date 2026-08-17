from django.contrib import admin

from .models import Project, ProjectMembership


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "owner",
        "status",
        "created_at",
        "updated_at",
    )

    list_filter = (
        "status",
        "created_at",
    )

    search_fields = (
        "name",
        "description",
        "owner__username",
        "owner__email",
    )


@admin.register(ProjectMembership)
class ProjectMembershipAdmin(admin.ModelAdmin):
    list_display = (
        "project",
        "user",
        "role",
        "joined_at",
    )

    list_filter = (
        "role",
        "joined_at",
    )

    search_fields = (
        "project__name",
        "user__username",
        "user__email",
    )