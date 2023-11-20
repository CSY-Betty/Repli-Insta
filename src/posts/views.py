from django.shortcuts import render, redirect
from django.urls import reverse_lazy
from .models import Post, Like, Comment
from profiles.models import Profile
from .forms import PostModelForm, CommentModelForm
from django.views.generic import UpdateView, DeleteView
from django.contrib import messages
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.core.serializers import serialize
import json
from .serializers import (
    PostProfileSerializer,
    PostSerializer,
    CommentSerializer,
    LikePostSerializer,
)
from rest_framework.generics import (
    ListAPIView,
    CreateAPIView,
    UpdateAPIView,
    ListCreateAPIView,
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
        # 查看接收到的資料
        received_data = self.request.data
        print("Received data:", received_data)

        # 如果您需要在創建 Comment 之前執行其他邏輯，可以在這裡實現
        print("Performing additional logic before creating Comment...")

        # 繼續執行原始的 perform_create
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


@login_required
def like_unlike_post(request):
    user = request.user
    if request.method == "POST":
        post_id = request.POST.get("post_id")
        post_obj = Post.objects.get(id=post_id)
        profile = Profile.objects.get(user=user)

        if profile in post_obj.liked.all():
            post_obj.liked.remove(profile)
        else:
            post_obj.liked.add(profile)

        like, created = Like.objects.get_or_create(user=profile, post_id=post_id)

        if not created:
            if like.value == "Like":
                like.value = "Unlike"
            else:
                like.value == "Like"
        else:
            like.value = "Like"

            post_obj.save()
            like.save()

        data = {"value": like.value, "likes": post_obj.liked.all().count()}

        return JsonResponse(data, safe=False)

    return redirect("posts:main-post-view")


class PostDeleteView(LoginRequiredMixin, DeleteView):
    model = Post
    template_name = "posts/confirm_del.html"
    success_url = reverse_lazy("posts:main-post-view")
    # success_url = "/posts/"

    def get_delete_post(self, *args, **kwargs):
        pk = self.kwargs.get("pk")
        post = Post.objects.get(pk=pk)

        if not post.author.user == self.request.user:
            messages.warning(self.request, "You need to be the author.")

        return post


class PostUpdateView(LoginRequiredMixin, UpdateView):
    form_class = PostModelForm
    model = Post
    template_name = "posts/update.html"
    success_url = reverse_lazy("posts:main-post-view")

    def form_valid(self, form):
        profile = Profile.objects.get(user=self.request.user)
        if form.instance.author == profile:
            return super().form_valid(form)
        else:
            form.add_error(None, "You need to be the author.")
            return super().form_invalid(form)


def get_comment(request):
    post_id = request.GET.get("post_id")
    post = Post.objects.get(id=post_id)
    comments = list(Comment.objects.filter(post=post))

    comment_list = []
    for comment in comments:
        comment_data = serialize("json", [comment], fields=("user", "body", "created"))
        comment_fields = json.loads(comment_data)[0]["fields"]

        commenter_instance = comment_fields["user"]
        commenter_profile = Profile.objects.get(id=commenter_instance)

        commenter_avatar = commenter_profile.avatar.url
        commenter = commenter_profile.user.username

        comment_info = {
            "content": comment_fields["body"],
            "commenter_avatar": commenter_avatar,
            "commenter": commenter,
            "comment_time": comment_fields["created"],
        }
        comment_list.append(comment_info)

    response_data = {"status": "success", "comments": comment_list}
    return JsonResponse(response_data)
