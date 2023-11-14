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

# Create your views here.


@login_required
def my_profile_setting(request):
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
        return render(request, "profiles/myprofilesetting.html", context)


@login_required
def my_profile(request):
    profile = Profile.objects.get(user=request.user)
    user_posts = profile.posts.all()

    context = {
        "profile": profile,
        "user_posts": user_posts,
    }

    return render(request, "profiles/myprofile.html", context)


""" another method
    confirm = False

    if request.method == "POST":
        form = ProfileModelForm(request.POST, request.FILES, instance=profile)
        if form.is_valid():
            form.save()
            confirm = True
        else:
            print(form.errors)
    else:
        form = ProfileModelForm(instance=profile)

    context = {"profile": profile, "form": form, "confirm": confirm}

    return render(request, "profiles/myprofile.html", context)
"""


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


class ProfileDetailView(LoginRequiredMixin, DetailView):
    model = Profile
    template_name = "profiles/detail.html"

    def get_object(self, slug=None):
        slug = self.kwargs.get("slug")
        profile = Profile.objects.get(slug=slug)
        return profile

    def get_context_data(self, **kwargs: Any) -> dict[str, Any]:
        context = super().get_context_data(**kwargs)
        user = User.objects.get(username__iexact=self.request.user)
        profile = Profile.objects.get(user=user)

        # invited other users to friends
        relationship_receiver_query = Relationship.objects.filter(sender=profile)
        # invited by other users to friends
        relationship_sender_query = Relationship.objects.filter(receiver=profile)

        relationship_receiver = []
        relationship_sender = []

        for item in relationship_receiver_query:
            relationship_receiver.append(item.receiver.user)

        for item in relationship_sender_query:
            relationship_sender.append(item.sender.user)

        context["relationship_receiver"] = relationship_receiver
        context["relationship_sender"] = relationship_sender

        context["posts"] = self.get_object().get_all_authors_posts()
        context["len_posts"] = (
            True if len(self.get_object().get_all_authors_posts()) > 0 else False
        )

        return context


""" function view
def profile_list_view(request):
    user = request.user

    sender = Profile.objects.get_all_profiles(user)
    print(Relationship.objects.invitations_received)

    context = {"sender": sender}

    return render(request, "profiles/profile_list.html", context)
"""


class ProfileListView(LoginRequiredMixin, ListView):
    model = Profile
    template_name = "profiles/profile_list.html"
    # default: context_object_name = "object_list"
    context_object_name = "sender"

    def get_queryset(self) -> QuerySet[Any]:
        query = Profile.objects.get_all_profiles(self.request.user)
        return query

    def get_context_data(self, **kwargs: Any) -> dict[str, Any]:
        context = super().get_context_data(**kwargs)
        user = User.objects.get(username__iexact=self.request.user)
        profile = Profile.objects.get(user=user)
        # pass profile to the template
        # context["profile"] = profile

        # invited other users to friends
        relationship_receiver_query = Relationship.objects.filter(sender=profile)
        # invited by other users to friends
        relationship_sender_query = Relationship.objects.filter(receiver=profile)

        relationship_receiver = []
        relationship_sender = []

        for item in relationship_receiver_query:
            relationship_receiver.append(item.receiver.user)

        for item in relationship_sender_query:
            relationship_sender.append(item.sender.user)

        context["relationship_receiver"] = relationship_receiver
        context["relationship_sender"] = relationship_sender

        context["is_empty"] = False
        if len(self.get_queryset()) == 0:
            context["is_empty"] = True

        return context


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
