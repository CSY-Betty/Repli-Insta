from django.urls import path
from .views import (
    posts,
    CustomPostView,
    CustomCommentView,
    CustomLikePostView,
)

app_name = "posts"

urlpatterns = [
    path("", posts, name="main-post-view"),
    path("post/", CustomPostView.as_view(), name="post"),
    path("comment/", CustomCommentView.as_view(), name="comment"),
    path("like/", CustomLikePostView.as_view(), name="postlike"),
]
