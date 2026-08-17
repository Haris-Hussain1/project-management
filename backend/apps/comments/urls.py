from django.urls import path

from .views import (
    CommentDetailView,
    CommentListCreateView,
)


urlpatterns = [
    path(
        "projects/<int:project_id>/tasks/<int:task_id>/comments/",
        CommentListCreateView.as_view(),
        name="comment-list-create",
    ),
    path(
        "projects/<int:project_id>/tasks/<int:task_id>/comments/<int:comment_id>/",
        CommentDetailView.as_view(),
        name="comment-detail",
    ),
]