from django.urls import path
from .views import (
    profiles,
    profile,
    profileSet,
    friend_list,
    likedposts_list,
    CustomProfileView,
    CustomRelationView,
)

app_name = "profiles"

urlpatterns = [
    path(
        "testfriends/",
        CustomRelationView.as_view(),
        name="testfriends",
    ),
    path(
        "testprofile/",
        CustomProfileView.as_view(),
        name="testprofile",
    ),
    path("", profiles, name="profiles"),
    path("profile/set/", profileSet, name="profile-set"),
    path("<slug>/", profile, name="profile-view"),
    path("profile/friends/", friend_list, name="friends"),
    path(
        "profile/likedposts/",
        likedposts_list,
        name="liked-posts",
    ),
]
