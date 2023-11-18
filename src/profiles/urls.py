from django.urls import path
from .views import (
    profile_update,
    invites_received_view,
    invite_profile_list_view,
    ProfileListView,
    send_invations,
    remove_from_friends,
    accept_invitation,
    reject_invitation,
    profiles,
    ProfilePostView,
    profile,
    profileSet,
    ProfileUpdateView,
    RelationshipListView,
    friend_list,
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
    # old
    path("profileupdate/", profile_update, name="profileupdate"),
    path("my-invites/", invites_received_view, name="my-invites-view"),
    path("to-invite/", invite_profile_list_view, name="invite-profiles-view"),
    path("send-invite/", send_invations, name="send-invite"),
    path("remove-friend/", remove_from_friends, name="remove-friend"),
    path("my-invites/accept/", accept_invitation, name="accept-invite"),
    path("my-invites/reject/", reject_invitation, name="reject-invite"),
]
