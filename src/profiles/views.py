from typing import Any
from django.shortcuts import render, get_object_or_404
from .models import Profile, Relationship
from django.db.models import Q
from django.contrib.auth.mixins import LoginRequiredMixin
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

from rest_framework import status
from django.contrib.auth.mixins import LoginRequiredMixin

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
