from django.shortcuts import render
from .models import Post, Like, Comment

from django.contrib.auth.decorators import login_required
from django.db.models.query import QuerySet
from django.utils.decorators import method_decorator

from .serializers import (
    PostSerializer,
    CommentSerializer,
    LikePostSerializer,
)

from rest_framework.generics import (
    CreateAPIView,
    ListCreateAPIView,
    get_object_or_404,
)
from rest_framework.response import Response
from rest_framework.renderers import JSONOpenAPIRenderer
from rest_framework import status
from rest_framework.permissions import IsAuthenticated


from rest_framework.mixins import (
    CreateModelMixin,
    UpdateModelMixin,
    DestroyModelMixin,
)

from rest_framework.views import APIView


# Create your views here.


def posts(request):
    return render(request, "posts/posts.html")


@method_decorator(login_required, name="post")
@method_decorator(login_required, name="patch")
@method_decorator(login_required, name="delete")
class CustomPostView(UpdateModelMixin, CreateModelMixin, DestroyModelMixin, APIView):
    serializer_class = PostSerializer
    queryset = Post.objects.all()
    lookup_field = "id"
    renderer_classes = [JSONOpenAPIRenderer]

    def get_object(self):
        post_id = self.request.GET.get("id")
        author = self.request.GET.get("author")

        queryset = Post.objects.all()

        if post_id:
            return get_object_or_404(Post, id=post_id)
        elif author:
            return queryset.filter(author=author)
        else:
            return None

    def get_serializer(self, *args, **kwargs):
        if self.request.method in ["PATCH", "POST"]:
            kwargs["context"] = {"request": self.request}
        return self.serializer_class(*args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = request.data
        data["author"] = request.user.id
        serializer = self.serializer_class(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, *args, **kwargs):
        post_id = request.GET.get("id")
        post = get_object_or_404(Post, id=post_id)

        if post.author.id != request.user.id:
            return Response(
                {"message": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED
            )

        serializer = self.serializer_class(post, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        post_id = request.GET.get("id")
        post = get_object_or_404(Post, id=post_id)

        if post.author.id != request.user.id:
            return Response(
                {"message": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED
            )

        self.destroy(request, *args, **kwargs)

        return Response(
            {"message": "Post deleted successfully"}, status=status.HTTP_200_OK
        )

    def get(self, request, *args, **kwargs):
        post = self.get_object()

        if post is not None:
            if isinstance(post, QuerySet):
                serializer = self.serializer_class(post, many=True)
            else:
                serializer = self.serializer_class(post)

            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            queryset = Post.objects.all()
            serializer = self.serializer_class(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)


@method_decorator(login_required, name="post")
class CustomCommentView(ListCreateAPIView):
    serializer_class = CommentSerializer
    renderer_classes = [JSONOpenAPIRenderer]

    def get_queryset(self):
        post_id = self.request.GET.get("id")
        return Comment.objects.filter(post__id=post_id)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        if not queryset.exists():
            return Response(
                {"message": "There is no comments."},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = self.get_serializer(queryset, many=True)

        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        mutable_data = request.data.copy()
        mutable_data["user"] = request.user.id
        mutable_data["post"] = self.request.GET.get("id")

        serializer = self.get_serializer(data=mutable_data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


@method_decorator(login_required, name="post")
class CustomLikePostView(CreateAPIView):
    serializer_class = LikePostSerializer
    renderer_classes = [JSONOpenAPIRenderer]
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        post_id = self.request.GET.get("id")
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
