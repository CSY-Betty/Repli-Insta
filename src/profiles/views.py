from typing import Any
from django.shortcuts import render, get_object_or_404
from .models import Profile, Relationship
from django.db.models import Q
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.http import JsonResponse
from .serializers import (
    ProfileSerializer,
    ProfilePostSerializer,
    RelationshipSerializer,
)
from posts.models import Post

from posts.serializers import PostSerializer
from rest_framework.response import Response
from rest_framework.renderers import JSONOpenAPIRenderer
from rest_framework.generics import (
    ListAPIView,
    UpdateAPIView,
    CreateAPIView,
    DestroyAPIView,
)

from rest_framework.mixins import UpdateModelMixin, CreateModelMixin, DestroyModelMixin

from rest_framework import status
from django.contrib.auth.mixins import LoginRequiredMixin
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated


# Create your views here.


def profiles(request):
    return render(request, "profiles/profiles.html")


def profile(request, slug):
    return render(request, "profiles/profile.html", {"slug": slug})


def profileSet(request):
    user = request.user
    profile = Profile.objects.get(user=user)
    context = {
        "profile": profile,
    }
    return render(request, "profiles/profile-set.html", context)


def friend_list(request):
    return render(request, "profiles/friends.html")


def likedposts_list(request):
    return render(request, "profiles/likedposts.html")


class ProfileUpdateView(UpdateAPIView):
    serializer_class = ProfileSerializer
    renderer_classes = [JSONOpenAPIRenderer]
    queryset = Profile.objects.all()
    allowed_methods = ["PUT", "PATCH"]

    def get_object(self):
        return self.queryset.get(user=self.request.user)


class ProfileListView(ListAPIView):
    serializer_class = ProfileSerializer
    renderer_classes = [JSONOpenAPIRenderer]

    def get_queryset(self):
        user = self.request.user
        queryset = Profile.objects.get_all_profiles(user)

        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        return Response(serializer.data)


class ProfilePostView(ListAPIView):
    serializer_class = ProfilePostSerializer
    renderer_classes = [JSONOpenAPIRenderer]

    def get(self, request, *args, **kwargs):
        slug = request.GET.get("slug")
        profile = Profile.objects.get(slug=slug)
        serializer = ProfilePostSerializer(profile)

        return Response(serializer.data)


class RelationshipListView(ListAPIView):
    serializer_class = RelationshipSerializer
    renderer_classes = [JSONOpenAPIRenderer]

    def get_queryset(self):
        user = self.request.user
        queryset = Relationship.objects.filter(
            Q(sender=user.profile) | Q(receiver=user.profile)
        )
        return queryset


class CreateRelationView(CreateAPIView, LoginRequiredMixin):
    serializer_class = RelationshipSerializer
    renderer_classes = [JSONOpenAPIRenderer]

    def perform_create(self, serializer):
        sender_profile = self.request.user.profile
        receiver_id = self.request.data.get("receiver", None)

        try:
            receiver_profile = Profile.objects.get(user__id=receiver_id)
        except Profile.DoesNotExist:
            return JsonResponse({"error": "Receiver profile not found."}, status=404)

        serializer.save(sender=sender_profile, receiver=receiver_profile)

        return Response(
            {"message": "Relationship created successfully."},
            status=status.HTTP_201_CREATED,
        )


class AcceptRelationView(UpdateAPIView, LoginRequiredMixin):
    serializer_class = RelationshipSerializer
    renderer_classes = [JSONOpenAPIRenderer]

    def get_queryset(self):
        user = self.request.user.profile
        sender_id = self.request.data.get("sender")

        return Relationship.objects.filter(
            receiver=user, sender__id=sender_id, status="send"
        )

    def perform_update(self, serializer):
        serializer.save(status="accepted")

    def get_object(self):
        sender_id = self.request.data.get("sender")
        queryset = self.get_queryset()

        return get_object_or_404(queryset, sender__id=sender_id)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)


class RejectRelationshipView(DestroyAPIView, LoginRequiredMixin):
    serializer_class = RelationshipSerializer
    renderer_classes = [JSONOpenAPIRenderer]
    lookup_field = "sender__id"

    def get_queryset(self):
        user = self.request.user.profile
        sender_id = self.request.data.get("sender")

        return Relationship.objects.filter(
            receiver=user, sender__id=sender_id, status="send"
        )

    def perform_destroy(self, instance):
        instance.delete()

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)


class RemoveRelationshipView(DestroyAPIView, LoginRequiredMixin):
    serializer_class = RelationshipSerializer
    renderer_classes = [JSONOpenAPIRenderer]
    queryset = Relationship.objects.filter(status="accepted")
    lookup_field = "pk"

    def delete(self, request, *args, **kwargs):
        user_profile = request.user.profile
        counterpart_profile_id = request.data.get("counterpart_profile_id")

        queryset = self.get_queryset().filter(
            (Q(sender=user_profile) | Q(receiver=user_profile)),
            (
                Q(sender_id=counterpart_profile_id)
                | Q(receiver_id=counterpart_profile_id)
            ),
        )

        if queryset.exists():
            # 使用 DestroyAPIView 的 destroy 方法
            queryset.delete()
            return Response(
                {"message": "Friend removed successfully"}, status=status.HTTP_200_OK
            )
        else:
            return Response(
                {"message": "Friend relationship not found"},
                status=status.HTTP_404_NOT_FOUND,
            )


@method_decorator(login_required, name="patch")
class CustomProfileView(UpdateModelMixin, ListAPIView):
    queryset = Profile.objects.all()
    lookup_field = "id"
    renderer_classes = [JSONOpenAPIRenderer]

    def get_object(self):
        if "id" in self.request.GET:
            obj = get_object_or_404(Profile, id=self.request.GET.get("id"))
        elif "slug" in self.request.GET:
            obj = get_object_or_404(Profile, slug=self.request.GET.get("slug"))
        else:
            obj = None

        return obj

    def get_serializer_class(self):
        if "id" in self.request.GET or "slug" in self.request.GET:
            return ProfilePostSerializer
        return ProfileSerializer

    def patch(self, request, *args, **kwargs):
        author_id = int(request.GET.get("id"))
        profile = get_object_or_404(Profile, id=author_id)

        if author_id != request.user.id:
            return Response(
                {"message": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED
            )

        serializer_class = self.get_serializer_class()
        serializer = serializer_class(profile, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, *args, **kwargs):
        profile = self.get_object()

        if profile:
            serializer_class = self.get_serializer_class()
            serializer = serializer_class(profile)
            return Response(serializer.data, status=status.HTTP_200_OK)

        else:
            queryset = Profile.objects.all()
            serializer_class = self.get_serializer_class()
            serializer = serializer_class(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)


class CustomRelationView(
    ListAPIView, CreateAPIView, UpdateAPIView, DestroyAPIView, LoginRequiredMixin
):
    serializer_class = RelationshipSerializer
    renderer_classes = [JSONOpenAPIRenderer]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_profile = self.request.user.profile
        return Relationship.objects.filter(
            Q(sender=user_profile) | Q(receiver=user_profile)
        )

    def get_object(self):
        sender_id = self.request.data.get("sender")
        queryset = self.get_queryset()
        return get_object_or_404(queryset, sender__id=sender_id)

    def post(self, request, *args, **kwargs):
        sender_profile = self.request.user.profile
        receiver_id = self.request.data.get("receiver", None)

        serializer = RelationshipSerializer(
            data={
                "sender": sender_profile.id,
                "receiver": receiver_id,
                "status": "send",
            }
        )

        if serializer.is_valid():
            instance = serializer.save()

            return Response(
                {"message": "Relationship created successfully."},
                status=status.HTTP_201_CREATED,
            )
        else:
            print(serializer.errors)
            return JsonResponse({"error": "Invalid data provided."}, status=400)

    def put(self, request, *args, **kwargs):
        action = self.request.data.get("action")

        if action not in ["accept", "reject"]:
            return Response(
                {"error": "Invalid action provided."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        instance = self.get_object()

        if action == "accept":
            instance.status = "accepted"
            instance.save()
            return Response({"message": "Relationship accepted."}, status=200)
        else:
            instance.delete()
            return Response(
                {"message": "Relationship rejected and removed."}, status=200
            )

    def delete(self, request, *args, **kwargs):
        user_profile = request.user.profile
        friend_id = request.query_params.get("friendId")

        queryset = self.get_queryset().filter(
            (Q(sender=user_profile) | Q(receiver=user_profile)),
            (Q(sender_id=friend_id) | Q(receiver_id=friend_id)),
        )

        if queryset.exists():
            queryset.delete()
            return Response(
                {"message": "Friend removed successfully"}, status=status.HTTP_200_OK
            )
        else:
            return Response(
                {"message": "Friend relationship not found"},
                status=status.HTTP_404_NOT_FOUND,
            )
