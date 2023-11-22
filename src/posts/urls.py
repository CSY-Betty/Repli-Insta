from django.urls import path
from .views import (
    PostDeleteView,
    PostUpdateView,
    PostsListView,
    posts,
    PostView,
    CommentView,
    CreateCommentView,
    CreatePostView,
    LikePostView,
    UserLikedPostsView,
)

app_name = "posts"

urlpatterns = [
    path("", posts, name="main-post-view"),
    # new
    path("posts-list/", PostsListView.as_view(), name="posts-list"),
    path("post/", PostView.as_view(), name="post"),
    path("post/create/", CreatePostView.as_view(), name="create-post"),
    path("post/update/<post_id>/", PostUpdateView.as_view(), name="update-post"),
    path("post/delete/<id>/", PostDeleteView.as_view(), name="delete-post"),
    path("comments/", CommentView.as_view(), name="comments"),
    path("comment/create/", CreateCommentView.as_view(), name="create-comment"),
    path("post/like/<int:post_id>/", LikePostView.as_view(), name="like-post"),
    path("post/userliked/", UserLikedPostsView.as_view(), name="user-liked-posts"),
    # old
    # path("liked/", like_unlike_post, name="like-post-view"),
    # path("get-post", get_post, name="get-post"),
    # path("get-comment", get_comment, name="get-comment"),
    # path("<pk>/delete/", PostDeleteView.as_view(), name="post-delete"),
    # path("<pk>/update/", PostUpdateView.as_view(), name="post-update"),
]
