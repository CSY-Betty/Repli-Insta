from typing import Any
from django.db import models
from django.db.models.query import QuerySet
from django.shortcuts import render, redirect, get_object_or_404
from .models import Profile, Relationship
from .forms import ProfileModelForm
from django.views.generic import ListView, DetailView
from django.contrib.auth.models import User
from django.db.models import Q
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import JsonResponse
from django.core import serializers
from .serializers import (
    ProfileSerializer,
    ProfilePostSerializer,
    RelationshipSerializer,
)
from rest_framework.response import Response
from rest_framework.renderers import JSONOpenAPIRenderer
from rest_framework.generics import ListAPIView, UpdateAPIView, CreateAPIView

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


@login_required
def profile_update(request):
    user = request.user
    profile = Profile.objects.get(user=user)
    form = ProfileModelForm(request.POST, request.FILES, instance=profile)

    if request.method == "POST":
        if form.is_valid():
            form.save()

            data = {"status": "success", "message": "Operation completed successfully"}
            return JsonResponse(data)
        else:
            print(form.errors)
            data = {"status": "error", "message": "Form validation failed"}
            return JsonResponse(data)
    else:
        context = {
            "profile": profile,
            "form": form,
        }
        form = ProfileModelForm(instance=profile)
        return render(request, "profiles/profileupdate.html", context)


@login_required
def my_profile(request):
    profile = Profile.objects.get(user=request.user)
    user_posts = profile.posts.all()

    context = {
        "profile": profile,
        "user_posts": user_posts,
    }

    return render(request, "profiles/myprofile.html", context)


@login_required
def invites_received_view(request):
    profile = Profile.objects.get(user=request.user)
    sender = Relationship.objects.invitations_received(profile)
    results = list(map(lambda x: x.sender, sender))

    is_empty = False
    if len(results) == 0:
        is_empty = True

    context = {"sender": results, "is_empty": is_empty}

    return render(request, "profiles/my_invites.html", context)


@login_required
def accept_invitation(request):
    if request.method == "POST":
        pk = request.POST.get("profile_pk")
        sender = Profile.objects.get(pk=pk)
        receiver = Profile.objects.get(user=request.user)
        relationship = get_object_or_404(Relationship, sender=sender, receiver=receiver)

        if relationship.status == "send":
            print(relationship.status)
            relationship.status = "accepted"
            relationship.save()

    return redirect("profiles:my-invites-view")


@login_required
def reject_invitation(request):
    if request.method == "POST":
        pk = request.POST.get("profile_pk")
        sender = Profile.objects.get(pk=pk)
        receiver = Profile.objects.get(user=request.user)
        relationship = get_object_or_404(Relationship, sender=sender, receiver=receiver)
        relationship.delete()

    return redirect("profiles:my-invites-view")


@login_required
def invite_profile_list_view(request):
    user = request.user

    sender = Profile.objects.get_all_profiles_to_invite(user)
    print(Relationship.objects.invitations_received)

    context = {"sender": sender}

    return render(request, "profiles/to_invite_list.html", context)


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


@login_required
def send_invations(request):
    if request.method == "POST":
        pk = request.POST.get("profile_pk")
        user = request.user
        sender = Profile.objects.get(user=user)
        receiver = Profile.objects.get(pk=pk)

        relationship = Relationship.objects.create(
            sender=sender, receiver=receiver, status="send"
        )

        return redirect(request.META.get("HTTP_REFERER"))

    return redirect("profiles:my-profile-view")


@login_required
def remove_from_friends(request):
    if request.method == "POST":
        pk = request.POST.get("profile_pk")
        user = request.user
        sender = Profile.objects.get(user=user)
        receiver = Profile.objects.get(pk=pk)

        relationship = Relationship.objects.filter(
            (Q(sender=sender) & (Q(receiver=receiver)))
            | (Q(sender=receiver) & Q(receiver=sender))
        )

        relationship.delete()

        return redirect(request.META.get("HTTP_REFERER"))

    return redirect("profiles:my-profile-view")
