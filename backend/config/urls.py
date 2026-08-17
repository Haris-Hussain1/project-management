from django.contrib import admin
from django.urls import include, path


urlpatterns = [
    path(
        "admin/",
        admin.site.urls,
    ),

    path(
        "api/auth/",
        include("apps.users.urls"),
    ),

    path(
        "api/projects/",
        include("apps.projects.urls"),
    ),

    path(
        "api/tasks/",
        include("apps.tasks.urls"),
    ),

    path(
        "api/comments/",
        include("apps.comments.urls"),
    ),

    path(
        "api/notifications/",
        include("apps.notifications.urls"),
    ),
]