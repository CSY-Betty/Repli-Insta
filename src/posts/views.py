from django.shortcuts import render
from .models import Post, Like, Comment
from django.http import JsonResponse
from django.contrib.auth.mixins import LoginRequiredMixin
from django.core.serializers import serialize
import json
from .serializers import (
    PostProfileSerializer,
    PostSerializer,
    CommentSerializer,
    LikePostSerializer,
    UpdatePostSerializer,
    DeletePostSerializer,
)
from rest_framework.generics import (
    ListAPIView,
    CreateAPIView,
    UpdateAPIView,
    ListCreateAPIView,
    DestroyAPIView,
)
from rest_framework.response import Response
from rest_framework.renderers import JSONOpenAPIRenderer
from rest_framework import status
from rest_framework.permissions import IsAuthenticated


# Create your views here.


def posts(request):
    return render(request, "posts/posts.html")


def get_post(request):
    post_id = request.GET.get("post_id")
    post = Post.objects.get(id=post_id)

    if post_id is not None:
        try:
            post = Post.objects.get(id=post_id)
            post_data = serialize(
                "json", [post], fields=("id", "content", "created", "image")
            )
            data_fields = json.loads(post_data)[0]["fields"]
            post_id = json.loads(post_data)[0]["pk"]

            profile = post.author
            profile_data = serialize(
                "json",
                [
                    profile,
                ],
                fields=("first_name", "last_name", "avatar"),
            )

            profile_data_fields = json.loads(profile_data)[0]["fields"]

            response_data = {
                "status": "success",
                "post": {
                    "id": post_id,
                    "content": data_fields["content"],
                    "created": data_fields["created"],
                    "image_url": data_fields["image"],
                },
                "profile": {
                    "avatar": profile_data_fields["avatar"],
                    "first_name": profile_data_fields["first_name"],
                    "last_name": profile_data_fields["last_name"],
                },
            }
        except Post.DoesNotExist:
            response_data = {"status": "error", "message": "Post not found"}
    else:
        response_data = {"status": "error", "message": "Post ID not provided"}

    return JsonResponse(response_data)


class PostsListView(ListAPIView):
    serializer_class = PostProfileSerializer
    renderer_classes = [JSONOpenAPIRenderer]

    def get_queryset(self):
        return Post.objects.all()

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        return Response(serializer.data)


class PostView(ListAPIView):
    serializer_class = PostProfileSerializer
    renderer_classes = [JSONOpenAPIRenderer]

    def get_queryset(self):
        post_id = self.request.query_params.get("post_id")

        return Post.objects.filter(id=post_id)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        return Response(serializer.data)


class CreatePostView(CreateAPIView):
    serializer_class = PostSerializer
    enderer_classes = [JSONOpenAPIRenderer]

    def perform_create(self, serializer):
        received_data = self.request.data
        print("Received data:", received_data)

        print("Performing additional logic before creating Comment...")

        super().perform_create(serializer)


class CommentView(ListAPIView):
    serializer_class = CommentSerializer
    renderer_classes = [JSONOpenAPIRenderer]

    def get_queryset(self):
        post_id = self.request.query_params.get("post_id")

        return Comment.objects.filter(post__id=post_id)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        return Response(serializer.data)


class CreateCommentView(CreateAPIView):
    serializer_class = CommentSerializer
    renderer_classes = [JSONOpenAPIRenderer]


class LikePostView(ListCreateAPIView):
    serializer_class = LikePostSerializer
    renderer_classes = [JSONOpenAPIRenderer]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_profile = self.request.user.profile
        post_id = self.kwargs.get("post_id")

        return Like.objects.filter(user=user_profile, post_id=post_id)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        post_id = self.kwargs.get("post_id")
        user_profile = request.user.profile
        like_data = {"user": user_profile.id, "post": post_id, "value": True}

        existing_like = Like.objects.filter(**like_data).first()

        if existing_like:
            existing_like.delete()

            post = Post.objects.get(id=post_id)
            post.liked.remove(user_profile)
            return Response(
                {"message": "Like removed successfully."}, status=status.HTTP_200_OK
            )
        else:
            serializer = self.get_serializer(data=like_data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            post = Post.objects.get(id=post_id)
            post.liked.add(user_profile)
            headers = self.get_success_headers(serializer.data)
            return Response(
                serializer.data, status=status.HTTP_201_CREATED, headers=headers
            )


class UserLikedPostsView(ListAPIView):
    serializer_class = PostProfileSerializer
    renderer_classes = [JSONOpenAPIRenderer]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_profile = self.request.user.profile
        liked_posts = Post.objects.filter(liked=user_profile)
        return liked_posts

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class PostUpdateView(UpdateAPIView, LoginRequiredMixin):
    serializer_class = UpdatePostSerializer
    queryset = Post.objects.all()
    lookup_field = "id"


class PostDeleteView(DestroyAPIView, LoginRequiredMixin):
    serializer_class = DeletePostSerializer
    queryset = Post.objects.all()
    lookup_field = "id"

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            self.perform_destroy(instance)
            return Response(
                {"message": "Post deleted successfully"}, status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
