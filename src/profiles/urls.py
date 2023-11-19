from django.urls import path
from .views import (
    profiles,
    profile,
    profileSet,
    friend_list,
    likedposts_list,
    ProfileListView,
    ProfilePostView,
    ProfileUpdateView,
    RelationshipListView,
    CreateRelationView,
    AcceptRelationView,
    RejectRelationshipView,
)

app_name = "profiles"

urlpatterns = [
    path("", profiles, name="profiles"),
    path("all-profiles/", ProfileListView.as_view(), name="all-profiles-view"),
    path("profile/", ProfilePostView.as_view(), name="profile"),
    path("profile/set/", profileSet, name="profile-set"),
    path("profile/set/update/", ProfileUpdateView.as_view(), name="profile-update"),
    path("<slug>/", profile, name="profile-view"),
    path("profile/friends/", friend_list, name="friends"),
    path("profile/friends/list", RelationshipListView.as_view(), name="friends-list"),
    path("profile/friends/add/", CreateRelationView.as_view(), name="add-friend"),
    path("profile/friends/accept/", AcceptRelationView.as_view(), name="accept-friend"),
    path(
        "profile/friends/reject/<int:sender__id>",
        RejectRelationshipView.as_view(),
        name="reject-friend",
    ),
    path(
        "profile/likedposts/",
        likedposts_list,
        name="liked-posts",
    ),
]
