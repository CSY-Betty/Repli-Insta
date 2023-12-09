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
    path("post/", CustomPostView.as_view(), name="test"),
    path("testcomment/", CustomCommentView.as_view(), name="testcomment"),
    path("testlike/", CustomLikePostView.as_view(), name="testlike"),
]
